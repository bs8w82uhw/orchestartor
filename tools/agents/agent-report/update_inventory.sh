#!/usr/bin/env bash
set -euo pipefail

SUMMARY_FILE="${SUMMARY_FILE:-/tmp/xyops_check_summary.json}"
OUT_FILE="${OUT_FILE:-docs/automation/codex/XYOPS_INVENTORY_SNAPSHOT.md}"
BASE_URL="${BASE_URL:-https://127.0.0.1:5523}"

if [[ ! -f "$SUMMARY_FILE" ]]; then
  echo "Summary file not found: $SUMMARY_FILE" >&2
  exit 1
fi

python3 - <<'PY'
import json
from pathlib import Path
import os

summary_path = Path(os.environ.get('SUMMARY_FILE'))
out_path = Path(os.environ.get('OUT_FILE'))
base_url = os.environ.get('BASE_URL')

summary = json.loads(summary_path.read_text())

def fmt_list(items):
    return "\n".join([f"- `{i}`" for i in items]) if items else "- (none)"

content = f"""---
title: xyOps Inventory Snapshot
version: 1
---

## Purpose

Track the current logical inventory for xyOps (groups, buckets, channels, webhooks, events, tags, roles).

## Latest Snapshot

Source: `{summary_path}`
Base URL: `{base_url}`

### Groups

{fmt_list(summary.get('groups', []))}

### Buckets

{fmt_list(summary.get('buckets', []))}

### Channels

{fmt_list(summary.get('channels', []))}

### Webhooks

{fmt_list(summary.get('webhooks', []))}

### Events

{fmt_list(summary.get('events', []))}

### Tags

{fmt_list(summary.get('tags', []))}

### Roles

{fmt_list(summary.get('roles', []))}
"""

out_path.write_text(content, encoding='utf-8')
print(f"Updated {out_path}")
PY
