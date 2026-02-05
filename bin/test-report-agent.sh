#!/usr/bin/env bash
set -euo pipefail

ts="$(date -u +%Y%m%d-%H%M%S)"
iso_ts="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
report_dir="docs/automation/reports"
raw_log="test/logs/unit-output-${ts}.log"
report_file="${report_dir}/TEST-REPORT-${ts}.md"

mkdir -p "${report_dir}" test/logs

run_cmd='docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto sh -lc "mkdir -p conf && cp -rf sample_conf/* conf/ && npm install --include=dev && npm test"'

set +e
bash -lc "${run_cmd}" > "${raw_log}" 2>&1
rc=$?
set -e

passed_line="$(grep -E 'Tests passed:' "${raw_log}" | tail -n 1 || true)"
failed_line="$(grep -E 'Tests failed:' "${raw_log}" | tail -n 1 || true)"
assert_line="$(grep -E 'Assertions:' "${raw_log}" | tail -n 1 || true)"
time_line="$(grep -E 'Time Elapsed:' "${raw_log}" | tail -n 1 || true)"
error_line="$(grep -E 'X - Errors occurred' "${raw_log}" | tail -n 1 || true)"

{
  echo "---"
  echo "title: Test Report ${ts}"
  echo "---"
  echo
  echo "## Metadata"
  echo
  echo "- Generated: ${iso_ts}"
  echo "- Exit code: ${rc}"
  echo "- Command: \`${run_cmd}\`"
  echo "- Knowledge base: https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/"
  echo
  echo "## Summary"
  echo
  echo "- ${passed_line:-Tests passed: n/a}"
  echo "- ${failed_line:-Tests failed: n/a}"
  echo "- ${assert_line:-Assertions: n/a}"
  echo "- ${time_line:-Time Elapsed: n/a}"
  if [[ -n "${error_line}" ]]; then
    echo "- Status marker: ${error_line}"
  fi
  echo
  echo "## Top Failing Assertions"
  echo
  if grep -q "Assert Failed:" "${raw_log}"; then
    grep "Assert Failed:" "${raw_log}" | head -n 20 | sed 's/^/- /'
  else
    echo "- No explicit \`Assert Failed:\` lines found."
  fi
  echo
  echo "## First Runtime Errors"
  echo
  if grep -E -q "TypeError|ReferenceError|SyntaxError|Unhandled|Uncaught Exception" "${raw_log}"; then
    grep -E "TypeError|ReferenceError|SyntaxError|Unhandled|Uncaught Exception" "${raw_log}" | head -n 20 | sed 's/^/- /'
  else
    echo "- No runtime error markers found."
  fi
  echo
  echo "## Raw Log"
  echo
  echo "- ${raw_log}"
} > "${report_file}"

echo "Report generated: ${report_file}"
echo "Raw log: ${raw_log}"
exit "${rc}"
