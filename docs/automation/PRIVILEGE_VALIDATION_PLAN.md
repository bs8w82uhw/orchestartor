---
title: Privilege Validation & Test Plan
---

## Purpose

Define a clear, repeatable validation plan for privilege enforcement. This document provides a test matrix that maps each privilege to a primary API endpoint and expected behavior.

## Scope

The following privileges must be validated:

create_alerts, edit_alerts, delete_alerts
create_buckets, edit_buckets, delete_buckets
create_categories, edit_categories, delete_categories
create_channels, edit_channels, delete_channels
create_events, edit_events, delete_events
create_groups, edit_groups, delete_groups
run_jobs, abort_jobs, delete_jobs, tag_jobs, comment_jobs
create_monitors, edit_monitors, delete_monitors
create_plugins, edit_plugins, delete_plugins
create_roles, edit_roles, delete_roles
create_tags, edit_tags, delete_tags
create_tickets, edit_tickets, delete_tickets
create_web_hooks, edit_web_hooks, delete_web_hooks
create_snapshots, delete_snapshots
add_servers

## Preconditions

- A working xyOps instance with API access.
- A test user and API Key that can be modified during validation.
- Category and group resources exist for tests that require resource-level access.

## Method

For each privilege:

1. Negative test: call the endpoint without the privilege and confirm a 403 access error.
2. Positive test: grant only the required privilege and confirm the request proceeds past access checks (success or a non-access error).
3. Cleanup: delete created objects, remove privileges, and reset state.

Note: Some endpoints also require category, group, or target access. Ensure the test user has access to the relevant category/group when validating those privileges.

## Validation Matrix

| Privilege | Primary API Endpoint | Expected | Notes |
| --- | --- | --- | --- |
| create_alerts | POST /api/app/create_alert/v1 | 200 with new alert | Uses Alert schema. |
| edit_alerts | POST /api/app/update_alert/v1 | 200 with updated alert | Also used for test_alert. |
| delete_alerts | POST /api/app/delete_alert/v1 | 200 delete success |  |
| create_buckets | POST /api/app/create_bucket/v1 | 200 with new bucket |  |
| edit_buckets | POST /api/app/update_bucket/v1 | 200 update success | Also used for bucket write/upload. |
| delete_buckets | POST /api/app/delete_bucket/v1 | 200 delete success |  |
| create_categories | POST /api/app/create_category/v1 | 200 with new category |  |
| edit_categories | POST /api/app/update_category/v1 | 200 update success |  |
| delete_categories | POST /api/app/delete_category/v1 | 200 delete success |  |
| create_channels | POST /api/app/create_channel/v1 | 200 with new channel |  |
| edit_channels | POST /api/app/update_channel/v1 | 200 update success |  |
| delete_channels | POST /api/app/delete_channel/v1 | 200 delete success |  |
| create_events | POST /api/app/create_event/v1 | 200 with new event | Requires category/target access. |
| edit_events | POST /api/app/update_event/v1 | 200 update success | Requires category/target access. |
| delete_events | POST /api/app/delete_event/v1 | 200 delete success | Requires category/target access. |
| create_groups | POST /api/app/create_group/v1 | 200 with new group | Requires group-level access. |
| edit_groups | POST /api/app/update_group/v1 | 200 update success | Requires group-level access. |
| delete_groups | POST /api/app/delete_group/v1 | 200 delete success | Requires group-level access. |
| run_jobs | POST /api/app/run_event/v1 | 200 job created | Requires category/target access. |
| abort_jobs | POST /api/app/abort_job/v1 | 200 job aborted | Requires category/target access. |
| delete_jobs | POST /api/app/delete_job/v1 | 200 job deleted | Requires category/target access. |
| tag_jobs | POST /api/app/update_job/v1 | 200 tags updated | Applies to completed jobs. |
| comment_jobs | N/A | N/A | Not found in privileges list or API docs. Needs clarification. |
| create_monitors | POST /api/app/create_monitor/v1 | 200 with new monitor |  |
| edit_monitors | POST /api/app/update_monitor/v1 | 200 update success |  |
| delete_monitors | POST /api/app/delete_monitor/v1 | 200 delete success |  |
| create_plugins | POST /api/app/create_plugin/v1 | 200 with new plugin |  |
| edit_plugins | POST /api/app/update_plugin/v1 | 200 update success |  |
| delete_plugins | POST /api/app/delete_plugin/v1 | 200 delete success |  |
| create_roles | POST /api/app/create_role/v1 | 200 with new role |  |
| edit_roles | POST /api/app/update_role/v1 | 200 update success |  |
| delete_roles | POST /api/app/delete_role/v1 | 200 delete success |  |
| create_tags | POST /api/app/create_tag/v1 | 200 with new tag |  |
| edit_tags | POST /api/app/update_tag/v1 | 200 update success |  |
| delete_tags | POST /api/app/delete_tag/v1 | 200 delete success |  |
| create_tickets | POST /api/app/create_ticket/v1 | 200 with new ticket |  |
| edit_tickets | POST /api/app/update_ticket/v1 | 200 update success | Includes comments via changes API. |
| delete_tickets | POST /api/app/delete_ticket/v1 | 200 delete success |  |
| create_web_hooks | POST /api/app/create_web_hook/v1 | 200 with new web hook |  |
| edit_web_hooks | POST /api/app/update_web_hook/v1 | 200 update success |  |
| delete_web_hooks | POST /api/app/delete_web_hook/v1 | 200 delete success |  |
| create_snapshots | POST /api/app/create_snapshot/v1 | 200 snapshot created | Also create_group_snapshot. |
| delete_snapshots | POST /api/app/delete_snapshot/v1 | 200 delete success |  |
| add_servers | UI Add Server + server registration API | 200 register success | See Servers docs for add flow. |

## Payload Templates (Minimal Examples)

Use these minimal JSON payloads to reach the privilege checks (they are intentionally small but valid).

```json
{
  "create_alerts": {"title":"UT Alert","expression":"1 == 1","message":"OK"},
  "edit_alerts": {"id":"a1"},
  "delete_alerts": {"id":"a1"},
  "create_buckets": {"title":"UT Bucket"},
  "edit_buckets": {"id":"b1"},
  "delete_buckets": {"id":"b1"},
  "create_categories": {"id":"cat1","title":"UT Category"},
  "edit_categories": {"id":"cat1"},
  "delete_categories": {"id":"cat1"},
  "create_channels": {"title":"UT Channel"},
  "edit_channels": {"id":"ch1"},
  "delete_channels": {"id":"ch1"},
  "create_events": {"id":"e1","title":"UT Event","enabled":1,"category":"general","targets":["*"],"algo":"all","plugin":"test_plugin"},
  "edit_events": {"id":"e1"},
  "delete_events": {"id":"e1"},
  "create_groups": {"id":"g1","title":"UT Group","hostname_match":".*"},
  "edit_groups": {"id":"g1"},
  "delete_groups": {"id":"g1"},
  "run_jobs": {"id":"e1"},
  "abort_jobs": {"id":"j1"},
  "delete_jobs": {"id":"j1"},
  "tag_jobs": {"id":"j1","tags":["tag-a"]},
  "create_monitors": {"id":"m1","title":"UT Monitor","source":"host","data_type":"json"},
  "edit_monitors": {"id":"m1"},
  "delete_monitors": {"id":"m1"},
  "create_plugins": {"id":"p1","title":"UT Plugin","type":"event","enabled":true},
  "edit_plugins": {"id":"p1"},
  "delete_plugins": {"id":"p1"},
  "create_roles": {"id":"r1","title":"UT Role"},
  "edit_roles": {"id":"r1"},
  "delete_roles": {"id":"r1"},
  "create_tags": {"id":"t1","title":"UT Tag"},
  "edit_tags": {"id":"t1"},
  "delete_tags": {"id":"t1"},
  "create_tickets": {"id":"t1","subject":"UT Ticket"},
  "edit_tickets": {"id":"t1"},
  "delete_tickets": {"id":"t1"},
  "create_web_hooks": {"id":"w1","title":"UT WebHook","method":"POST","url":"https://example.com/hook"},
  "edit_web_hooks": {"id":"w1"},
  "delete_web_hooks": {"id":"w1"},
  "create_snapshots": {"server":"satunit1"},
  "delete_snapshots": {"id":"s1"},
  "add_servers": {}
}
```

## Manual Validation Checklist

Use this checklist for full validation and evidence capture.

- [ ] create_alerts: negative 403 + positive create success
- [ ] edit_alerts: negative 403 + positive update success
- [ ] delete_alerts: negative 403 + positive delete success
- [ ] create_buckets: negative 403 + positive create success
- [ ] edit_buckets: negative 403 + positive update success
- [ ] delete_buckets: negative 403 + positive delete success
- [ ] create_categories: negative 403 + positive create success
- [ ] edit_categories: negative 403 + positive update success
- [ ] delete_categories: negative 403 + positive delete success
- [ ] create_channels: negative 403 + positive create success
- [ ] edit_channels: negative 403 + positive update success
- [ ] delete_channels: negative 403 + positive delete success
- [ ] create_events: negative 403 + positive create success
- [ ] edit_events: negative 403 + positive update success
- [ ] delete_events: negative 403 + positive delete success
- [ ] create_groups: negative 403 + positive create success
- [ ] edit_groups: negative 403 + positive update success
- [ ] delete_groups: negative 403 + positive delete success
- [ ] run_jobs: negative 403 + positive run success
- [ ] abort_jobs: negative 403 + positive abort success
- [ ] delete_jobs: negative 403 + positive delete success
- [ ] tag_jobs: negative 403 + positive tag success
- [ ] comment_jobs: requires clarification (not found in privileges list or API docs)
- [ ] create_monitors: negative 403 + positive create success
- [ ] edit_monitors: negative 403 + positive update success
- [ ] delete_monitors: negative 403 + positive delete success
- [ ] create_plugins: negative 403 + positive create success
- [ ] edit_plugins: negative 403 + positive update success
- [ ] delete_plugins: negative 403 + positive delete success
- [ ] create_roles: negative 403 + positive create success
- [ ] edit_roles: negative 403 + positive update success
- [ ] delete_roles: negative 403 + positive delete success
- [ ] create_tags: negative 403 + positive create success
- [ ] edit_tags: negative 403 + positive update success
- [ ] delete_tags: negative 403 + positive delete success
- [ ] create_tickets: negative 403 + positive create success
- [ ] edit_tickets: negative 403 + positive update success
- [ ] delete_tickets: negative 403 + positive delete success
- [ ] create_web_hooks: negative 403 + positive create success
- [ ] edit_web_hooks: negative 403 + positive update success
- [ ] delete_web_hooks: negative 403 + positive delete success
- [ ] create_snapshots: negative 403 + positive create success
- [ ] delete_snapshots: negative 403 + positive delete success
- [ ] add_servers: negative 403 + positive token generation success

## Expected Errors

When a privilege is missing, the API should return a 403 access error with a message indicating the required privilege.

## Reporting

Record each privilege test with:

- Privilege name
- Endpoint tested
- Request payload summary
- Result (pass/fail)
- Error message (if any)
- Evidence (log excerpt or response body)
