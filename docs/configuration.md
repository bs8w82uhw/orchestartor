# Configuration

xyOps is configured primarily by a single JSON file located here: `/opt/xyops/conf/config.json` (the location may vary for custom installs).

However, if the configuration is modified using the UI, overrides are saved in a separate file: `/opt/xyops/conf/overrides.json`

This document describes all the editable properties in the `config.json` file.

## base_app_url



## email_from

## secret_key

## mail_settings

### mail_settings.host

### mail_settings.port

### mail_settings.auth



## email_format

## max_emails_per_day

## log_dir

## log_filename

## log_columns

## log_archive_path

## log_crashes

## temp_dir

## pid_file

## debug_level

## tick_precision_ms

## maintenance

## ttl

## file_expiration

## timeline_expiration

## ping_freq_sec

## ping_timeout_sec

## max_jobs_per_min

## child_kill_timeout

## dead_job_timeout

## job_env

## job_universal_limits

## job_universal_actions

## alert_universal_actions

## hostname_display_strip

## ip_display_strip

## search_file_threads

## search_file_regex



## tickets

### tickets.email_enabled

### tickets.email_debounce_sec

### tickets.overdue_schedule

### tickets.overdue_query

### tickets.due_date_format

### tickets.date_time_format



## hooks

## hook_text_templates



## multi

### multi.list_url

### multi.protocol

### multi.connect_timeout_sec

### multi.master_timeout_sec

### multi.socket_opts



## satellite

### satellite.list_url

### satellite.base_url

### satellite.version

### satellite.cache_ttl

### satellite.config



## quick_monitors

## default_user_privileges

## default_user_prefs



## db_maint

### db_maint.jobs

#### db_maint.jobs.max_rows

### db_maint.alerts

#### db_maint.alerts.max_rows

### db_maint.snapshots

#### db_maint.snapshots.max_rows

### db_maint.activity

#### db_maint.activity.max_rows

### db_maint.servers

#### db_maint.servers.max_rows



## airgap

### airgap.enabled

### airgap.outbound_whitelist

### airgap.outbound_blacklist



## client

### client.name

### client.logo_url

### client.items_per_page

### client.alt_items_per_page

### client.events_per_page

### client.max_table_rows

### client.max_menu_items

### client.alt_to_toggle

### client.new_event_template

### client.chart_defaults

### client.editor_defaults

### client.bucket_upload_settings

### client.ticket_upload_settings

### client.job_upload_settings



## Storage

### Storage.engine

### Storage.list_page_size

### Storage.hash_page_size

### Storage.concurrency

### Storage.transactions

### Storage.network_transactions

### Storage.trans_auto_recover

### Storage.trans_dir

### Storage.log_event_types

### Storage.Hybrid

#### Storage.Hybrid.docEngine

#### Storage.Hybrid.binaryEngine

### Storage.Filesystem

### Storage.SQLite

### Storage.AWS

### Storage.S3



## WebServer

### WebServer.port

### WebServer.htdocs_dir

### WebServer.max_upload_size

### WebServer.static_ttl

### WebServer.static_index

### WebServer.server_signature

### WebServer.compress_text

### WebServer.enable_brotli

### WebServer.timeout

### WebServer.regex_json

### WebServer.clean_headers

### WebServer.log_socket_errors

### WebServer.response_headers

### WebServer.keep_alives

### WebServer.keep_alive_timeout

### WebServer.max_connections

### WebServer.max_concurrent_requests

### WebServer.log_requests

### WebServer.legacy_callback_support

### WebServer.startup_message

### WebServer.debug_ttl

### WebServer.debug_bind_local

### WebServer.whitelist

### WebServer.blacklist

### WebServer.uri_response_headers

### WebServer.https

### WebServer.https_port

### WebServer.https_cert_file

### WebServer.https_key_file

### WebServer.https_force

### WebServer.https_timeout

### WebServer.https_header_detect



## User

### User.session_expire_days

### User.max_failed_logins_per_hour

### User.max_forgot_passwords_per_hour

### User.free_accounts

### User.sort_global_users

### User.use_bcrypt

### User.mail_logger

### User.valid_username_match

### User.block_username_match

### User.cookie_settings



## Debug

### Debug.enabled



## config_overrides_file
