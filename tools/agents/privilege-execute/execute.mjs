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

const headers = {
  'Content-Type': 'application/json',
  'Connection': 'close',
  'X-Session-ID': '',
  'X-API-Key': apiKey
};

const stepDelayMs = Number.parseInt(process.env.XYOPS_STEP_DELAY_MS || '100', 10);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const redactKey = (text) => {
  if (!text) return text;
  return text.split(apiKey).join('[REDACTED]');
};

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
      return {
        ok: false,
        status: 'n/a',
        data: { code: 'curl', description: redactKey(message) }
      };
    }
  }
}

const stamp = Date.now().toString(36);
const mkId = (suffix) => `ut${stamp}${suffix}`;

const ids = {
  alert: mkId('alert'),
  bucket: mkId('bucket'),
  category: mkId('cat'),
  channel: mkId('chan'),
  event: mkId('event'),
  group: mkId('grp'),
  monitor: mkId('mon'),
  plugin: mkId('plug'),
  role: mkId('role'),
  tag: mkId('tag'),
  ticket: mkId('ticket'),
  webhook: mkId('hook')
};

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

async function main() {
  const plugins = await post('/api/app/get_plugins/v1', {});
  record('get_plugins', plugins);

  let eventPluginId = null;
  let eventPluginParams = {};
  if (plugins.data && Array.isArray(plugins.data.rows)) {
    const found = plugins.data.rows.find((p) => p.type === 'event');
    if (found) {
      eventPluginId = found.id;
      if (Array.isArray(found.params)) {
        for (const param of found.params) {
          if (param.value !== undefined) eventPluginParams[param.id] = param.value;
          else if (param.type === 'checkbox') eventPluginParams[param.id] = false;
          else if (param.type === 'code') eventPluginParams[param.id] = '';
          else eventPluginParams[param.id] = '';
        }
      }
    }
  }

  // create base resources
  record('create_category', await post('/api/app/create_category/v1', { id: ids.category, title: 'UT Category' }));
  record('create_group', await post('/api/app/create_group/v1', { id: ids.group, title: 'UT Group', hostname_match: '.*' }));

  // create plugin for create/edit/delete testing
  record('create_plugin', await post('/api/app/create_plugin/v1', {
    id: ids.plugin,
    title: 'UT Plugin',
    type: 'event',
    enabled: 1,
    command: '/bin/echo',
    params: []
  }));
  record('edit_plugin', await post('/api/app/update_plugin/v1', { id: ids.plugin, title: 'UT Plugin Updated' }));

  // if no event plugin found, use the one we created
  if (!eventPluginId) {
    eventPluginId = ids.plugin;
  }

  record('create_channel', await post('/api/app/create_channel/v1', {
    id: ids.channel,
    title: 'UT Channel',
    enabled: true,
    users: ['admin']
  }));
  record('edit_channel', await post('/api/app/update_channel/v1', { id: ids.channel, notes: 'Updated by privilege-execute' }));

  record('create_bucket', await post('/api/app/create_bucket/v1', { id: ids.bucket, title: 'UT Bucket' }));
  record('edit_bucket', await post('/api/app/update_bucket/v1', { id: ids.bucket, title: 'UT Bucket Updated' }));

  record('create_alert', await post('/api/app/create_alert/v1', {
    id: ids.alert,
    title: 'UT Alert',
    expression: '1 == 1',
    message: 'OK'
  }));
  record('edit_alert', await post('/api/app/update_alert/v1', { id: ids.alert, message: 'Updated' }));

  record('create_tag', await post('/api/app/create_tag/v1', { id: ids.tag, title: 'UT Tag' }));
  record('edit_tag', await post('/api/app/update_tag/v1', { id: ids.tag, title: 'UT Tag Updated' }));

  record('create_role', await post('/api/app/create_role/v1', { id: ids.role, title: 'UT Role' }));
  record('edit_role', await post('/api/app/update_role/v1', { id: ids.role, title: 'UT Role Updated' }));

  record('create_monitor', await post('/api/app/create_monitor/v1', {
    id: ids.monitor,
    title: 'UT Monitor',
    source: 'cpu.currentLoad',
    data_type: 'float',
    groups: []
  }));
  record('edit_monitor', await post('/api/app/update_monitor/v1', { id: ids.monitor, title: 'UT Monitor Updated' }));

  record('create_web_hook', await post('/api/app/create_web_hook/v1', {
    id: ids.webhook,
    title: 'UT WebHook',
    method: 'POST',
    url: 'https://example.com/hook'
  }));
  record('edit_web_hook', await post('/api/app/update_web_hook/v1', { id: ids.webhook, title: 'UT WebHook Updated' }));

  record('create_ticket', await post('/api/app/create_ticket/v1', {
    id: ids.ticket,
    subject: 'UT Ticket',
    body: 'Created by privilege-execute'
  }));
  record('edit_ticket', await post('/api/app/update_ticket/v1', { id: ids.ticket, subject: 'UT Ticket Updated' }));

  // events + jobs
  const eventCreate = await post('/api/app/create_event/v1', {
    id: ids.event,
    title: 'UT Event',
    enabled: 1,
    category: ids.category,
    targets: [ids.group],
    algo: 'all',
    plugin: eventPluginId,
    params: eventPluginParams,
    triggers: [
      { type: 'manual', enabled: true }
    ]
  });
  record('create_event', eventCreate);
  record('edit_event', await post('/api/app/update_event/v1', { id: ids.event, title: 'UT Event Updated' }));

  const getJob = async (id) => post('/api/app/get_job/v1', { id });
  const waitForState = async (id, states, timeoutMs = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const res = await getJob(id);
      if (res.data && res.data.code === 0 && res.data.job && states.includes(res.data.job.state)) {
        return res;
      }
      await sleep(300);
    }
    return null;
  };

  // Run a long job for abort testing
  const runAbort = await post('/api/app/run_event/v1', { id: ids.event, test: true, params: { duration: 60 } });
  record('run_job_abort', runAbort);
  const abortJobId = runAbort.data && runAbort.data.id ? runAbort.data.id : null;
  if (abortJobId) {
    await waitForState(abortJobId, ['active', 'finishing', 'complete']);
    record('abort_job', await post('/api/app/abort_job/v1', { id: abortJobId }));
  } else {
    record('abort_job', { status: 'n/a', data: { code: 'no_job' } }, { note: 'No abort job id returned' });
  }

  // Run a short job for tag/delete testing
  const run = await post('/api/app/run_event/v1', { id: ids.event, test: true, params: { duration: 1 } });
  record('run_job', run);
  const jobId = run.data && run.data.id ? run.data.id : null;
  if (jobId) {
    const completed = await waitForState(jobId, ['complete'], 20000);
    if (!completed) {
      record('tag_job', { status: 'n/a', data: { code: 'job' } }, { note: 'Job did not complete in time for tag/delete' });
      record('delete_job', { status: 'n/a', data: { code: 'job' } }, { note: 'Job did not complete in time for tag/delete' });
    } else {
      record('tag_job', await post('/api/app/manage_job_tags/v1', { id: jobId, tags: ['ut'] }));
      record('delete_job', await post('/api/app/delete_job/v1', { id: jobId }));
    }
  } else {
    record('tag_job', { status: 'n/a', data: { code: 'no_job' } }, { note: 'No job id returned' });
    record('delete_job', { status: 'n/a', data: { code: 'no_job' } }, { note: 'No job id returned' });
  }

  // snapshots
  const snap = await post('/api/app/create_group_snapshot/v1', { group: ids.group });
  record('create_snapshot', snap);
  const snapId = snap.data && snap.data.id ? snap.data.id : null;
  if (snapId) {
    record('delete_snapshot', await post('/api/app/delete_snapshot/v1', { id: snapId }));
  } else {
    record('delete_snapshot', { status: 'n/a', data: { code: 'no_snapshot' } }, { note: 'No snapshot id returned' });
  }

  // add servers (token)
  record('add_servers', await post('/api/app/get_satellite_token/v1', {}));

  // deletes (reverse order)
  record('delete_event', await post('/api/app/delete_event/v1', { id: ids.event }));
  record('delete_web_hook', await post('/api/app/delete_web_hook/v1', { id: ids.webhook }));
  record('delete_ticket', await post('/api/app/delete_ticket/v1', { id: ids.ticket }));
  record('delete_monitor', await post('/api/app/delete_monitor/v1', { id: ids.monitor }));
  record('delete_role', await post('/api/app/delete_role/v1', { id: ids.role }));
  record('delete_tag', await post('/api/app/delete_tag/v1', { id: ids.tag }));
  record('delete_alert', await post('/api/app/delete_alert/v1', { id: ids.alert }));
  record('delete_bucket', await post('/api/app/delete_bucket/v1', { id: ids.bucket }));
  record('delete_channel', await post('/api/app/delete_channel/v1', { id: ids.channel }));
  record('delete_plugin', await post('/api/app/delete_plugin/v1', { id: ids.plugin }));
  record('delete_group', await post('/api/app/delete_group/v1', { id: ids.group }));
  record('delete_category', await post('/api/app/delete_category/v1', { id: ids.category }));

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
