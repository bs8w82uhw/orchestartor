const baseUrl = process.env.XYOPS_BASE_URL || 'http://localhost:5522';
const adminKey = process.env.XYOPS_API_KEY;

if (!adminKey) {
  console.error('XYOPS_API_KEY is required');
  process.exit(1);
}

const headers = (key) => ({
  'Content-Type': 'application/json',
  'X-Session-ID': '',
  'X-API-Key': key
});

async function post(path, body, key) {
  const res = await fetch(baseUrl + path, {
    method: 'POST',
    headers: headers(key),
    body: JSON.stringify(body || {})
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return { ok: false, status: res.status, data: { code: 'parse', description: text.slice(0, 200) } };
  }
  return { ok: res.ok, status: res.status, data };
}

const tests = [
  { priv: 'create_alerts', path: '/api/app/create_alert/v1', payload: { title: 'UT Alert', expression: '1 == 1', message: 'OK' } },
  { priv: 'edit_alerts', path: '/api/app/update_alert/v1', payload: { id: 'a1' } },
  { priv: 'delete_alerts', path: '/api/app/delete_alert/v1', payload: { id: 'a1' } },

  { priv: 'create_buckets', path: '/api/app/create_bucket/v1', payload: { title: 'UT Bucket' } },
  { priv: 'edit_buckets', path: '/api/app/update_bucket/v1', payload: { id: 'b1' } },
  { priv: 'delete_buckets', path: '/api/app/delete_bucket/v1', payload: { id: 'b1' } },

  { priv: 'create_categories', path: '/api/app/create_category/v1', payload: { id: 'cat1', title: 'UT Category' } },
  { priv: 'edit_categories', path: '/api/app/update_category/v1', payload: { id: 'cat1' } },
  { priv: 'delete_categories', path: '/api/app/delete_category/v1', payload: { id: 'cat1' } },

  { priv: 'create_channels', path: '/api/app/create_channel/v1', payload: { title: 'UT Channel' } },
  { priv: 'edit_channels', path: '/api/app/update_channel/v1', payload: { id: 'ch1' } },
  { priv: 'delete_channels', path: '/api/app/delete_channel/v1', payload: { id: 'ch1' } },

  { priv: 'create_events', path: '/api/app/create_event/v1', payload: (ctx) => ({
      id: 'e1',
      title: 'UT Event',
      enabled: 1,
      category: ctx.categoryId,
      targets: [ctx.groupId],
      algo: 'all',
      plugin: ctx.eventPluginId
    })
  },
  { priv: 'edit_events', path: '/api/app/update_event/v1', payload: { id: 'e1' } },
  { priv: 'delete_events', path: '/api/app/delete_event/v1', payload: { id: 'e1' } },

  { priv: 'create_groups', path: '/api/app/create_group/v1', payload: { id: 'g1', title: 'UT Group', hostname_match: '.*' } },
  { priv: 'edit_groups', path: '/api/app/update_group/v1', payload: { id: 'g1' } },
  { priv: 'delete_groups', path: '/api/app/delete_group/v1', payload: { id: 'g1' } },

  { priv: 'run_jobs', path: '/api/app/run_event/v1', payload: { id: 'e1' } },
  { priv: 'abort_jobs', path: '/api/app/abort_job/v1', payload: { id: 'j1' } },
  { priv: 'delete_jobs', path: '/api/app/delete_job/v1', payload: { id: 'j1' } },
  { priv: 'tag_jobs', path: '/api/app/manage_job_tags/v1', payload: { id: 'j1', tags: ['tag-a'] } },

  { priv: 'comment_jobs', path: null, payload: null, note: 'Not found in privileges/API docs' },

  { priv: 'create_monitors', path: '/api/app/create_monitor/v1', payload: { id: 'm1', title: 'UT Monitor', source: 'host', data_type: 'json' } },
  { priv: 'edit_monitors', path: '/api/app/update_monitor/v1', payload: { id: 'm1' } },
  { priv: 'delete_monitors', path: '/api/app/delete_monitor/v1', payload: { id: 'm1' } },

  { priv: 'create_plugins', path: '/api/app/create_plugin/v1', payload: { id: 'p1', title: 'UT Plugin', type: 'event', enabled: true } },
  { priv: 'edit_plugins', path: '/api/app/update_plugin/v1', payload: { id: 'p1' } },
  { priv: 'delete_plugins', path: '/api/app/delete_plugin/v1', payload: { id: 'p1' } },

  { priv: 'create_roles', path: '/api/app/create_role/v1', payload: { id: 'r1', title: 'UT Role' } },
  { priv: 'edit_roles', path: '/api/app/update_role/v1', payload: { id: 'r1' } },
  { priv: 'delete_roles', path: '/api/app/delete_role/v1', payload: { id: 'r1' } },

  { priv: 'create_tags', path: '/api/app/create_tag/v1', payload: { id: 't1', title: 'UT Tag' } },
  { priv: 'edit_tags', path: '/api/app/update_tag/v1', payload: { id: 't1' } },
  { priv: 'delete_tags', path: '/api/app/delete_tag/v1', payload: { id: 't1' } },

  { priv: 'create_tickets', path: '/api/app/create_ticket/v1', payload: { id: 't1', subject: 'UT Ticket' } },
  { priv: 'edit_tickets', path: '/api/app/update_ticket/v1', payload: { id: 't1' } },
  { priv: 'delete_tickets', path: '/api/app/delete_ticket/v1', payload: { id: 't1' } },

  { priv: 'create_web_hooks', path: '/api/app/create_web_hook/v1', payload: { id: 'w1', title: 'UT WebHook', method: 'POST', url: 'https://example.com/hook' } },
  { priv: 'edit_web_hooks', path: '/api/app/update_web_hook/v1', payload: { id: 'w1' } },
  { priv: 'delete_web_hooks', path: '/api/app/delete_web_hook/v1', payload: { id: 'w1' } },

  { priv: 'create_snapshots', path: '/api/app/create_snapshot/v1', payload: { server: 'satunit1' } },
  { priv: 'delete_snapshots', path: '/api/app/delete_snapshot/v1', payload: { id: 's1' } },

  { priv: 'add_servers', path: '/api/app/get_satellite_token/v1', payload: {} }
];

async function main() {
  // gather dynamic context for valid payloads
  const cats = await post('/api/app/get_categories/v1', {}, adminKey);
  const grps = await post('/api/app/get_groups/v1', {}, adminKey);
  const plugs = await post('/api/app/get_plugins/v1', {}, adminKey);

  const categoryId = (cats.data.rows && cats.data.rows[0] && cats.data.rows[0].id) || 'general';
  const groupId = (grps.data.rows && grps.data.rows[0] && grps.data.rows[0].id) || 'main';
  let eventPluginId = 'shell';
  if (plugs.data.rows && Array.isArray(plugs.data.rows)) {
    const eventPlugin = plugs.data.rows.find((p) => p.type === 'event');
    if (eventPlugin && eventPlugin.id) eventPluginId = eventPlugin.id;
  }
  const ctx = { categoryId, groupId, eventPluginId };

  const create = await post('/api/app/create_api_key/v1', {
    title: 'Privilege Matrix Key',
    description: 'Created by privilege-check script',
    active: 1,
    privileges: {}
  }, adminKey);

  if (create.data.code !== 0) {
    console.error('Failed to create API key:', create.data);
    process.exit(2);
  }

  const testKey = create.data.plain_key;
  const testKeyId = create.data.api_key.id;

  const results = [];

  for (const item of tests) {
    if (!item.path) {
      results.push({ priv: item.priv, negative: 'skipped', positive: 'skipped', note: item.note });
      continue;
    }

    const payload = typeof item.payload === 'function' ? item.payload(ctx) : item.payload;

    const neg = await post(item.path, payload, testKey);
    const negOk = (neg.data.code === 'access');

    const upd = await post('/api/app/update_api_key/v1', { id: testKeyId, privileges: { [item.priv]: 1 } }, adminKey);
    const updOk = (upd.data.code === 0);

    const pos = await post(item.path, payload, testKey);
    const posOk = (pos.data.code !== 'access');

    results.push({
      priv: item.priv,
      negative: negOk ? 'pass' : `fail (${neg.data.code})`,
      positive: (updOk && posOk) ? 'pass' : `fail (${pos.data.code})`
    });
  }

  await post('/api/app/delete_api_key/v1', { id: testKeyId }, adminKey);

  const output = JSON.stringify({ baseUrl, results }, null, 2);
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
