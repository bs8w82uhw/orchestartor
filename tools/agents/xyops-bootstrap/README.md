# xyops-bootstrap

Bootstrap roles, buckets, events, and notifications for xyOps.

## Usage

```bash
export XYOPS_API_KEY="...api key..."
export XYOPS_BASE_URL="https://127.0.0.1:5523"
export OUT_LOG_AGENT="/tmp/xyops-bootstrap.json"  # optional
export XYOPS_STEP_DELAY_MS="100"                 # optional
./tools/agents/xyops-bootstrap/run.sh --insecure
```

## Notes

- This **mutates** the target environment (creates/updates roles, buckets, channels, events).
- All create calls are followed by update if the resource already exists.
- Ensure categories/groups exist for roles and events.
