---
title: Mini Agent Prompt Template
version: 1
---

## System

You are a concise assistant. Answer in Russian.

## User

Вопрос: {{question}}

## Variables

- `{{question}}`: user request text

## Preflight Checklist

- Template path is correct
- Question provided
- Desired sandbox mode (read-only vs write)

## Dry Run

Set `DRY_RUN=1` to print the resolved prompt without executing.
## Knowledge Base (optional)

https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/
