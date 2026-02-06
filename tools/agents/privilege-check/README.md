# Privilege Check Runner

Automated privilege validation against a running xyOps instance (e.g., Docker container on `http://localhost:5522`).

## Requirements

- xyOps is running and reachable at `XYOPS_BASE_URL` (default `https://localhost:5523`).
- An **admin** API key set in `XYOPS_API_KEY`.

## Run

```bash
export XYOPS_API_KEY="..."
export XYOPS_BASE_URL="https://localhost:5523"
export OUT_LOG_AGENT="/tmp/privilege-check.json"

./tools/agents/privilege-check/run.sh

# If using self-signed TLS:
./tools/agents/privilege-check/run.sh --insecure
```

## Output

JSON summary with `negative`/`positive` results per privilege. `comment_jobs` is skipped until a valid endpoint is defined.
