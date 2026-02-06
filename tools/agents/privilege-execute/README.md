# privilege-execute

Execute real create/edit/delete calls for the privilege list in a test environment.

## Usage

```bash
export XYOPS_API_KEY="...api key..."
export XYOPS_BASE_URL="https://localhost:5523"
export OUT_LOG_AGENT="/tmp/privilege-execute.json"  # optional
# Optional: slow down requests and reduce TLS resets
export XYOPS_STEP_DELAY_MS="200"
./tools/agents/privilege-execute/run.sh --insecure
```

## Notes

- This **mutates** data in the target environment.
- The script creates resources with unique IDs and attempts to clean them up.
- `comment_jobs` is not implemented (no known API endpoint).
- If a job finishes too quickly, tag/abort/delete may fail; these are still recorded in the report.
- The script retries failed HTTP calls up to 3 times and redacts API keys from error output.

## API Key Handling

xyOps REST API calls accept the API key in any one of these ways:

- `X-API-Key` HTTP request header (preferred)
- `api_key` query string parameter
- `api_key` JSON property

This tool uses the `X-API-Key` header. Ensure `XYOPS_API_KEY` is set in the environment before running.
