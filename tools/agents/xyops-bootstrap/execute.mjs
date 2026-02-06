const rawBaseUrl = process.env.XYOPS_BASE_URL || 'https://127.0.0.1:5523';
const baseUrl = rawBaseUrl
  .replace('https://localhost', 'https://127.0.0.1')
  .replace('http://localhost', 'http://127.0.0.1');

if (!process.env.XYOPS_BASE_URL) {
  console.log(`Using default XYOPS_BASE_URL: ${baseUrl}`);
}
const apiKey = process.env.XYOPS_API_KEY;

if (!apiKey) {
  console.error('XYOPS_API_KEY is required');
  process.exit(1);
}

const stepDelayMs = Number.parseInt(process.env.XYOPS_STEP_DELAY_MS || '100', 10);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const redactKey = (text) => (text ? text.split(apiKey).join('[REDACTED]') : text);

async function post(path, body) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);
  const url = baseUrl + path;
  const payload = JSON.stringify(body || {});

  const args = [
    '-sS',
    '-X', 'POST',
    '-H', `X-API-Key: ${apiKey}`,
    '-H', 'Content-Type: application/json',
    '-d', payload,
    url
  ];
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    args.unshift('-k');
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    if (stepDelayMs) await sleep(stepDelayMs);
    try {
      const { stdout } = await execFileAsync('curl', args, { maxBuffer: 10 * 1024 * 1024 });
      let data;
      try {
        data = JSON.parse(stdout);
      } catch (err) {
        data = { code: 'parse', description: stdout.slice(0, 200) };
      }
      return { ok: data.code === 0, status: data.code === 0 ? 200 : 400, data };
    } catch (err) {
      const stderr = err && err.stderr ? err.stderr.toString() : '';
      const message = stderr || (err && err.message ? err.message : 'curl failed');
      if (attempt < 3) {
        await sleep(250 * attempt);
        continue;
      }
      return { ok: false, status: 'n/a', data: { code: 'curl', description: redactKey(message) } };
    }
  }
}

const report = {
  baseUrl,
  startedAt: new Date().toISOString(),
  steps: []
};

function record(step, res, extra) {
  report.steps.push({
    step,
    status: (res && res.data && res.data.code === 0) ? 'ok' : 'fail',
    code: res && res.data ? res.data.code : 'n/a',
    statusCode: res ? res.status : 'n/a',
    description: res && res.data && res.data.description ? res.data.description : undefined,
    ...(extra || {})
  });
}

async function upsert(createPath, updatePath, payload, idKey = 'id') {
  const createRes = await post(createPath, payload);
  if (createRes.data && createRes.data.code === 0) return createRes;

  // fallback to update when already exists
  if (!payload[idKey]) return createRes;
  const updateRes = await post(updatePath, payload);
  return updateRes;
}

async function main() {
  // categories/groups
  record('upsert_category_ops', await upsert('/api/app/create_category/v1', '/api/app/update_category/v1', {
    id: 'ops',
    title: 'Ops'
  }));

  record('upsert_group_ops', await upsert('/api/app/create_group/v1', '/api/app/update_group/v1', {
    id: 'ops',
    title: 'Ops',
    hostname_match: '.*'
  }));
  record('upsert_group_ops_app', await upsert('/api/app/create_group/v1', '/api/app/update_group/v1', {
    id: 'opsapp',
    title: 'Ops App',
    hostname_match: '.*'
  }));
  record('upsert_group_ops_db', await upsert('/api/app/create_group/v1', '/api/app/update_group/v1', {
    id: 'opsdb',
    title: 'Ops DB',
    hostname_match: '.*'
  }));
  record('upsert_group_ops_infra', await upsert('/api/app/create_group/v1', '/api/app/update_group/v1', {
    id: 'opsinfra',
    title: 'Ops Infra',
    hostname_match: '.*'
  }));

  // buckets
  record('upsert_bucket_raw', await upsert('/api/app/create_bucket/v1', '/api/app/update_bucket/v1', {
    id: 'opsraw',
    title: 'Ops Raw'
  }));
  record('upsert_bucket_processed', await upsert('/api/app/create_bucket/v1', '/api/app/update_bucket/v1', {
    id: 'opsprocessed',
    title: 'Ops Processed'
  }));
  record('upsert_bucket_temp', await upsert('/api/app/create_bucket/v1', '/api/app/update_bucket/v1', {
    id: 'opstemp',
    title: 'Ops Temp'
  }));
  record('upsert_bucket_agentreports', await upsert('/api/app/create_bucket/v1', '/api/app/update_bucket/v1', {
    id: 'opsagentreports',
    title: 'Ops Agent Reports'
  }));

  // tags
  record('upsert_tag_incident', await upsert('/api/app/create_tag/v1', '/api/app/update_tag/v1', {
    id: 'incident',
    title: 'Incident'
  }));
  record('upsert_tag_change', await upsert('/api/app/create_tag/v1', '/api/app/update_tag/v1', {
    id: 'change',
    title: 'Change'
  }));
  record('upsert_tag_maintenance', await upsert('/api/app/create_tag/v1', '/api/app/update_tag/v1', {
    id: 'maintenance',
    title: 'Maintenance'
  }));
  record('upsert_tag_audit', await upsert('/api/app/create_tag/v1', '/api/app/update_tag/v1', {
    id: 'audit',
    title: 'Audit'
  }));

  // notification endpoints
  record('upsert_web_hook_ops', await upsert('/api/app/create_web_hook/v1', '/api/app/update_web_hook/v1', {
    id: 'opswebhook',
    title: 'Ops WebHook',
    method: 'POST',
    url: 'https://example.com/hook'
  }));

  record('upsert_channel_email', await upsert('/api/app/create_channel/v1', '/api/app/update_channel/v1', {
    id: 'opsemail',
    title: 'Ops Email',
    enabled: true,
    users: ['admin']
  }));

  record('upsert_channel_webhook', await upsert('/api/app/create_channel/v1', '/api/app/update_channel/v1', {
    id: 'opswebhookchan',
    title: 'Ops WebHook Channel',
    enabled: true,
    web_hook: 'opswebhook'
  }));

  // roles
  record('upsert_role_platform_admin', await upsert('/api/app/create_role/v1', '/api/app/update_role/v1', {
    id: 'platform_admin',
    title: 'Platform Admin',
    enabled: true,
    categories: ['ops'],
    groups: ['ops'],
    privileges: {
      create_alerts: true, edit_alerts: true, delete_alerts: true,
      create_buckets: true, edit_buckets: true, delete_buckets: true,
      create_categories: true, edit_categories: true, delete_categories: true,
      create_channels: true, edit_channels: true, delete_channels: true,
      create_events: true, edit_events: true, delete_events: true,
      create_groups: true, edit_groups: true, delete_groups: true,
      run_jobs: true, abort_jobs: true, tag_jobs: true,
      create_monitors: true, edit_monitors: true, delete_monitors: true,
      create_plugins: true, edit_plugins: true, delete_plugins: true,
      create_roles: true, edit_roles: true, delete_roles: true,
      create_tags: true, edit_tags: true, delete_tags: true,
      create_tickets: true, edit_tickets: true, delete_tickets: true,
      create_web_hooks: true, edit_web_hooks: true, delete_web_hooks: true,
      create_snapshots: true, delete_snapshots: true,
      add_servers: true
    }
  }));

  record('upsert_role_ops_executor', await upsert('/api/app/create_role/v1', '/api/app/update_role/v1', {
    id: 'ops_executor',
    title: 'Ops Executor',
    enabled: true,
    categories: ['ops'],
    groups: ['ops'],
    privileges: {
      create_events: true, edit_events: true, delete_events: true,
      run_jobs: true, abort_jobs: true, tag_jobs: true,
      create_snapshots: true, delete_snapshots: true
    }
  }));

  record('upsert_role_observer', await upsert('/api/app/create_role/v1', '/api/app/update_role/v1', {
    id: 'observer',
    title: 'Observer',
    enabled: true,
    categories: ['ops'],
    groups: ['ops'],
    privileges: {}
  }));

  // events
  record('upsert_event_daily_healthcheck', await upsert('/api/app/create_event/v1', '/api/app/update_event/v1', {
    id: 'eventdailyhealthcheck',
    title: 'Daily Healthcheck',
    enabled: 1,
    category: 'ops',
    targets: ['ops'],
    algo: 'all',
    plugin: 'testplug',
    params: {
      duration: 30
    },
    triggers: [
      { type: 'schedule', enabled: true, hours: [3], minutes: [0] },
      { type: 'manual', enabled: true }
    ]
  }));

  const orchestratorScript = `#!/bin/sh
set -e

API="\${XYOPS_BASE_URL:-https://127.0.0.1:5523}"
KEY="\${XYOPS_API_KEY:-}"

if [ -z "$KEY" ]; then
  echo "XYOPS_API_KEY is required"
  exit 1
fi

RESP=$(curl -ksS -H "X-API-Key: \${KEY}" -H "Content-Type: application/json" \\
  -d '{"query":"status:open tags:incident","limit":5,"compact":1}' \\
  "\${API}/api/app/search_tickets/v1")

IDS=$(printf "%s" "$RESP" | node -e 'const fs=require("fs");const d=JSON.parse(fs.readFileSync(0,"utf8"));console.log((d.rows||[]).map(r=>r.id).join(" "));')

for id in $IDS; do
  curl -ksS -H "X-API-Key: \${KEY}" -H "Content-Type: application/json" \\
    -d "{\\"id\\":\\"$id\\",\\"change\\":{\\"type\\":\\"comment\\",\\"body\\":\\"Orchestrator picked up this ticket.\\"}}" \\
    "\${API}/api/app/add_ticket_change/v1" >/dev/null || true

  curl -ksS -H "X-API-Key: \${KEY}" -H "Content-Type: application/json" \\
    -d "{\\"id\\":\\"eventincidenttriage\\",\\"test\\":true,\\"input\\":{\\"data\\":{\\"ticket_id\\":\\"$id\\"}}}" \\
    "\${API}/api/app/run_event/v1" >/dev/null || true
done
`;

  record('upsert_event_incident_triage', await upsert('/api/app/create_event/v1', '/api/app/update_event/v1', {
    id: 'eventincidenttriage',
    title: 'Incident Triage',
    enabled: 1,
    category: 'ops',
    targets: ['ops'],
    algo: 'all',
    plugin: 'shellplug',
    params: {
      script: '#!/bin/sh\\n\\n# TODO: implement triage steps; input ticket_id is in $XYOPS_INPUT_DATA (if provided).\\n\\necho \"Incident triage placeholder\"'
    },
    triggers: [
      { type: 'manual', enabled: true }
    ]
  }));

  record('upsert_event_change_approval', await upsert('/api/app/create_event/v1', '/api/app/update_event/v1', {
    id: 'eventchangeapproval',
    title: 'Change Approval',
    enabled: 1,
    category: 'ops',
    targets: ['ops'],
    algo: 'all',
    plugin: 'shellplug',
    params: {
      script: '#!/bin/sh\\n\\n# TODO: implement change approval steps.\\n\\necho \"Change approval placeholder\"'
    },
    triggers: [
      { type: 'manual', enabled: true }
    ]
  }));

  record('upsert_event_ticket_scheduler', await upsert('/api/app/create_event/v1', '/api/app/update_event/v1', {
    id: 'eventticketscheduler',
    title: 'Ticket Orchestrator Scheduler',
    enabled: 1,
    category: 'ops',
    targets: ['ops'],
    algo: 'all',
    plugin: 'shellplug',
    params: {
      script: orchestratorScript
    },
    triggers: [
      { type: 'schedule', enabled: true, minutes: [0,5,10,15,20,25,30,35,40,45,50,55] },
      { type: 'manual', enabled: true }
    ]
  }));

  const inventoryScript = `#!/bin/sh
set -e

API="${'${'}XYOPS_BASE_URL:-https://127.0.0.1:5523}"
KEY="${'${'}XYOPS_API_KEY:-}"

if [ -z "$KEY" ]; then
  echo "XYOPS_API_KEY is required"
  exit 1
fi

SUM=$(curl -ksS -H "X-API-Key: ${'${'}KEY}" -H "Content-Type: application/json" -d '{}' "${'${'}API}/api/app/get_groups/v1")
BUK=$(curl -ksS -H "X-API-Key: ${'${'}KEY}" -H "Content-Type: application/json" -d '{}' "${'${'}API}/api/app/get_buckets/v1")
EVT=$(curl -ksS -H "X-API-Key: ${'${'}KEY}" -H "Content-Type: application/json" -d '{}' "${'${'}API}/api/app/get_events/v1")

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)

DATA=$(node -e 'const g=JSON.parse(process.argv[1]); const b=JSON.parse(process.argv[2]); const e=JSON.parse(process.argv[3]); const out={timestamp:process.argv[4], groups:(g.rows||[]).map(r=>r.id), buckets:(b.rows||[]).map(r=>r.id), events:(e.rows||[]).map(r=>r.id)}; console.log(JSON.stringify(out));' "$SUM" "$BUK" "$EVT" "$NOW")

curl -ksS -H "X-API-Key: ${'${'}KEY}" -H "Content-Type: application/json" \\
  -d "{\\"id\\":\\"opsagentreports\\",\\"data\\":{\\"inventory\\":$DATA}}" \\
  "${'${'}API}/api/app/write_bucket_data/v1" >/dev/null
`;

  record('upsert_event_inventory_check', await upsert('/api/app/create_event/v1', '/api/app/update_event/v1', {
    id: 'eventinventorycheck',
    title: 'Inventory Check',
    enabled: 1,
    category: 'ops',
    targets: ['ops'],
    algo: 'all',
    plugin: 'shellplug',
    params: {
      script: inventoryScript
    },
    triggers: [
      { type: 'schedule', enabled: true, hours: [2], minutes: [0] },
      { type: 'manual', enabled: true }
    ]
  }));

  // summary
  report.finishedAt = new Date().toISOString();
  report.summary = {
    ok: report.steps.filter((s) => s.status === 'ok').length,
    fail: report.steps.filter((s) => s.status !== 'ok').length
  };

  const output = JSON.stringify(report, null, 2);
  if (process.env.OUT_LOG_AGENT) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(process.env.OUT_LOG_AGENT, output + '\n');
  }
  console.log(output);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
