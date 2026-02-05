const assert = require('node:assert/strict');

const PRIV_TESTS = [
  { priv: 'create_alerts', endpoint: '/app/create_alert/v1', payload: { title: 'UT Alert', expression: '1 == 1', message: 'OK' } },
  { priv: 'edit_alerts', endpoint: '/app/update_alert/v1', payload: { id: 'a1' } },
  { priv: 'delete_alerts', endpoint: '/app/delete_alert/v1', payload: { id: 'a1' } },

  { priv: 'create_buckets', endpoint: '/app/create_bucket/v1', payload: { title: 'UT Bucket' } },
  { priv: 'edit_buckets', endpoint: '/app/update_bucket/v1', payload: { id: 'b1' } },
  { priv: 'delete_buckets', endpoint: '/app/delete_bucket/v1', payload: { id: 'b1' } },

  { priv: 'create_categories', endpoint: '/app/create_category/v1', payload: { id: 'cat1', title: 'UT Category' } },
  { priv: 'edit_categories', endpoint: '/app/update_category/v1', payload: { id: 'cat1' } },
  { priv: 'delete_categories', endpoint: '/app/delete_category/v1', payload: { id: 'cat1' } },

  { priv: 'create_channels', endpoint: '/app/create_channel/v1', payload: { title: 'UT Channel' } },
  { priv: 'edit_channels', endpoint: '/app/update_channel/v1', payload: { id: 'ch1' } },
  { priv: 'delete_channels', endpoint: '/app/delete_channel/v1', payload: { id: 'ch1' } },

  { priv: 'create_events', endpoint: '/app/create_event/v1', payload: { id: 'e1', title: 'UT Event', enabled: 1, category: 'general', targets: ['*'], algo: 'all', plugin: 'test_plugin' } },
  { priv: 'edit_events', endpoint: '/app/update_event/v1', payload: { id: 'e1' } },
  { priv: 'delete_events', endpoint: '/app/delete_event/v1', payload: { id: 'e1' } },

  { priv: 'create_groups', endpoint: '/app/create_group/v1', payload: { id: 'g1', title: 'UT Group', hostname_match: '.*' } },
  { priv: 'edit_groups', endpoint: '/app/update_group/v1', payload: { id: 'g1' } },
  { priv: 'delete_groups', endpoint: '/app/delete_group/v1', payload: { id: 'g1' } },

  { priv: 'run_jobs', endpoint: '/app/run_event/v1', payload: { id: 'e1' } },
  { priv: 'abort_jobs', endpoint: '/app/abort_job/v1', payload: { id: 'j1' } },
  { priv: 'delete_jobs', endpoint: '/app/delete_job/v1', payload: { id: 'j1' } },
  { priv: 'tag_jobs', endpoint: '/app/manage_job_tags/v1', payload: { id: 'j1', tags: ['tag-a'] } },

  { priv: 'create_monitors', endpoint: '/app/create_monitor/v1', payload: { id: 'm1', title: 'UT Monitor', source: 'host', data_type: 'json' } },
  { priv: 'edit_monitors', endpoint: '/app/update_monitor/v1', payload: { id: 'm1' } },
  { priv: 'delete_monitors', endpoint: '/app/delete_monitor/v1', payload: { id: 'm1' } },

  { priv: 'create_plugins', endpoint: '/app/create_plugin/v1', payload: { id: 'p1', title: 'UT Plugin', type: 'event', enabled: true } },
  { priv: 'edit_plugins', endpoint: '/app/update_plugin/v1', payload: { id: 'p1' } },
  { priv: 'delete_plugins', endpoint: '/app/delete_plugin/v1', payload: { id: 'p1' } },

  { priv: 'create_roles', endpoint: '/app/create_role/v1', payload: { id: 'r1', title: 'UT Role' } },
  { priv: 'edit_roles', endpoint: '/app/update_role/v1', payload: { id: 'r1' } },
  { priv: 'delete_roles', endpoint: '/app/delete_role/v1', payload: { id: 'r1' } },

  { priv: 'create_tags', endpoint: '/app/create_tag/v1', payload: { id: 't1', title: 'UT Tag' } },
  { priv: 'edit_tags', endpoint: '/app/update_tag/v1', payload: { id: 't1' } },
  { priv: 'delete_tags', endpoint: '/app/delete_tag/v1', payload: { id: 't1' } },

  { priv: 'create_tickets', endpoint: '/app/create_ticket/v1', payload: { id: 't1', subject: 'UT Ticket' } },
  { priv: 'edit_tickets', endpoint: '/app/update_ticket/v1', payload: { id: 't1' } },
  { priv: 'delete_tickets', endpoint: '/app/delete_ticket/v1', payload: { id: 't1' } },

  { priv: 'create_web_hooks', endpoint: '/app/create_web_hook/v1', payload: { id: 'w1', title: 'UT WebHook', method: 'POST', url: 'https://example.com/hook' } },
  { priv: 'edit_web_hooks', endpoint: '/app/update_web_hook/v1', payload: { id: 'w1' } },
  { priv: 'delete_web_hooks', endpoint: '/app/delete_web_hook/v1', payload: { id: 'w1' } },

  { priv: 'create_snapshots', endpoint: '/app/create_snapshot/v1', payload: { server: 'satunit1' } },
  { priv: 'delete_snapshots', endpoint: '/app/delete_snapshot/v1', payload: { id: 's1' } },

  { priv: 'add_servers', endpoint: '/app/get_satellite_token/v1', payload: {} }
];

exports.tests = [
  async function test_privilege_access_matrix_negative(test) {
    // create a low-priv API key (no privileges)
    let { data } = await this.request.json(this.api_url + '/app/create_api_key/v1', {
      title: 'UT Privilege Matrix Key',
      description: 'Created by privilege matrix tests',
      active: 1,
      privileges: {}
    });
    assert.ok(data.code === 0, 'successful api response for api_key create');
    assert.ok(data.plain_key, 'expected plain api key');
    this.priv_api_key_id = data.api_key.id;
    this.priv_api_plain_key = data.plain_key;

    const headers = {
      'X-Session-ID': '',
      'X-API-Key': data.plain_key
    };

    for (const item of PRIV_TESTS) {
      let { data: resp } = await this.request.json(this.api_url + item.endpoint, item.payload, { headers });
      assert.ok(resp.code === 'access', `expected access error for ${item.priv}`);
    }
  },

  async function test_privilege_access_matrix_positive(test) {
    // reuse API key, grant one privilege at a time, expect non-access response
    const headers = {
      'X-Session-ID': '',
      'X-API-Key': this.priv_api_plain_key
    };

    for (const item of PRIV_TESTS) {
      let { data: upd } = await this.request.json(this.api_url + '/app/update_api_key/v1', {
        id: this.priv_api_key_id,
        privileges: { [item.priv]: 1 }
      });
      assert.ok(upd.code === 0, `failed to update api key for ${item.priv}`);

      let { data: resp } = await this.request.json(this.api_url + item.endpoint, item.payload, { headers });
      assert.ok(resp.code !== 'access', `expected non-access response for ${item.priv}`);
    }
  },

  async function test_privilege_access_matrix_cleanup(test) {
    if (!this.priv_api_key_id) return;
    let { data } = await this.request.json(this.api_url + '/app/delete_api_key/v1', {
      id: this.priv_api_key_id
    });
    assert.ok(data.code === 0, 'successful api_key delete');
  }
];
