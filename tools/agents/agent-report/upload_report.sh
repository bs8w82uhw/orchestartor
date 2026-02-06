#!/usr/bin/env bash
set -euo pipefail

INSECURE=0
BUCKET_ID="${BUCKET_ID:-opsagentreports}"
BASE_URL="${XYOPS_BASE_URL:-https://127.0.0.1:5523}"
REPORT_FILE="${REPORT_FILE:-${OUT_LOG_AGENT:-}}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --insecure)
      INSECURE=1
      shift
      ;;
    --bucket)
      BUCKET_ID="$2"
      shift 2
      ;;
    --file)
      REPORT_FILE="$2"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "${XYOPS_API_KEY:-}" ]]; then
  echo "XYOPS_API_KEY is required" >&2
  exit 1
fi

if [[ -z "${REPORT_FILE}" ]]; then
  echo "REPORT_FILE or OUT_LOG_AGENT is required" >&2
  exit 1
fi

if [[ ! -f "$REPORT_FILE" ]]; then
  echo "Report file not found: $REPORT_FILE" >&2
  exit 1
fi

CURL_ARGS=("-sS" "-X" "POST" "-H" "X-API-Key: ${XYOPS_API_KEY}" "-F" "id=${BUCKET_ID}" "-F" "file=@${REPORT_FILE}" "${BASE_URL}/api/app/upload_bucket_files/v1")

if [[ "$INSECURE" == "1" ]]; then
  CURL_ARGS=("-k" "${CURL_ARGS[@]}")
fi

curl "${CURL_ARGS[@]}"
