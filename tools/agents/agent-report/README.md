# agent-report uploader

Uploads mini‑agent reports to the `opsagentreports` bucket.

## Usage

```bash
export XYOPS_API_KEY="...api key..."
export XYOPS_BASE_URL="https://127.0.0.1:5523"
export OUT_LOG_AGENT="/tmp/agent-report.json"
./tools/agents/agent-report/upload_report.sh --insecure
```

## Options

- `--file <path>`: explicit report file
- `--bucket <id>`: bucket ID (default: `opsagentreports`)
- `--insecure`: allow self‑signed TLS
