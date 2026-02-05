#!/usr/bin/env bash
set -euo pipefail

ts="$(date -u +%Y%m%d-%H%M%S)"
iso_ts="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
report_dir="docs/automation/reports"
report_file="${report_dir}/TEST-REPORT-${ts}.md"
latest_report_md="${report_dir}/LATEST_TEST_REPORT.md"
latest_report_json="${report_dir}/LATEST_TEST_REPORT.json"
raw_log_dir="test/logs"

mkdir -p "${report_dir}"

pick_writable_log_dir() {
  local candidate
  local probe
  for candidate in "test/logs" "${report_dir}/raw-logs" "/tmp/xyops-test-logs"; do
    mkdir -p "${candidate}" 2>/dev/null || true
    probe="${candidate}/.write-check-${ts}"
    if ( : > "${probe}" ) 2>/dev/null; then
      rm -f "${probe}"
      echo "${candidate}"
      return 0
    fi
  done
  return 1
}

if ! raw_log_dir="$(pick_writable_log_dir)"; then
  echo "ERROR: no writable directory for raw logs" >&2
  exit 1
fi

raw_log="${raw_log_dir}/unit-output-${ts}.log"
echo "Using raw log dir: ${raw_log_dir}"

run_cmd='docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto sh -lc "mkdir -p conf && cp -rf sample_conf/* conf/ && npm install --include=dev && npm test"'

set +e
bash -lc "${run_cmd}" > "${raw_log}" 2>&1
rc=$?
set -e

if [[ ! -f "${raw_log}" ]]; then
  fallback_dir="${report_dir}/raw-logs"
  mkdir -p "${fallback_dir}"
  raw_log="${fallback_dir}/unit-output-${ts}.log"
  cat > "${raw_log}" <<EOF
test-report-agent: raw log was not created at initial path.
initial_log_dir=${raw_log_dir}
exit_code=${rc}
hint=check filesystem permissions for test/logs and rerun
EOF
fi

passed_line=""
failed_line=""
assert_line=""
time_line=""
error_line=""

if [[ -f "${raw_log}" ]]; then
  passed_line="$(grep -E 'Tests passed:' "${raw_log}" | tail -n 1 || true)"
  failed_line="$(grep -E 'Tests failed:' "${raw_log}" | tail -n 1 || true)"
  assert_line="$(grep -E 'Assertions:' "${raw_log}" | tail -n 1 || true)"
  time_line="$(grep -E 'Time Elapsed:' "${raw_log}" | tail -n 1 || true)"
  error_line="$(grep -E 'X - Errors occurred' "${raw_log}" | tail -n 1 || true)"
fi

passed_value="${passed_line#Tests passed: }"
failed_value="${failed_line#Tests failed: }"
assert_value="${assert_line#Assertions: }"
elapsed_value="${time_line#Time Elapsed: }"

[[ -z "${passed_line}" ]] && passed_value="unknown"
[[ -z "${failed_line}" ]] && failed_value="unknown"
[[ -z "${assert_line}" ]] && assert_value="unknown"
[[ -z "${time_line}" ]] && elapsed_value="unknown"

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
  if [[ -f "${raw_log}" ]] && grep -q "Assert Failed:" "${raw_log}"; then
    grep "Assert Failed:" "${raw_log}" | head -n 20 | sed 's/^/- /'
  else
    echo "- No explicit \`Assert Failed:\` lines found."
  fi
  echo
  echo "## First Runtime Errors"
  echo
  if [[ -f "${raw_log}" ]] && grep -E -q "TypeError|ReferenceError|SyntaxError|Unhandled|Uncaught Exception" "${raw_log}"; then
    grep -E "TypeError|ReferenceError|SyntaxError|Unhandled|Uncaught Exception" "${raw_log}" | head -n 20 | sed 's/^/- /'
  else
    echo "- No runtime error markers found."
  fi
  echo
  echo "## Raw Log"
  echo
  echo "- ${raw_log}"
  echo
  echo "## Machine Artifacts"
  echo
  echo "- ${latest_report_md}"
  echo "- ${latest_report_json}"
} > "${report_file}"

cat > "${latest_report_json}" <<EOF
{
  "generated_at": "${iso_ts}",
  "report_path": "${report_file}",
  "raw_log_path": "${raw_log}",
  "exit_code": ${rc},
  "tests_passed": "${passed_value}",
  "tests_failed": "${failed_value}",
  "assertions": "${assert_value}",
  "elapsed": "${elapsed_value}"
}
EOF

cp "${report_file}" "${latest_report_md}"

echo "Report generated: ${report_file}"
echo "Raw log: ${raw_log}"
echo "Latest report alias: ${latest_report_md}"
echo "Latest report json: ${latest_report_json}"
exit "${rc}"
