---
title: Mini Agent Report Template
version: 1
---

## Report

```json
{
  "timestamp": "{{timestamp}}",
  "agent": "{{agent}}",
  "workflow": "{{workflow}}",
  "scope": "{{scope}}",
  "summary": "{{summary}}",
  "result": "{{result}}",
  "evidence": {{evidence}},
  "notes": "{{notes}}"
}
```

## Variables

- `{{timestamp}}`: ISO timestamp
- `{{agent}}`: agent role/name
- `{{workflow}}`: workflow name (e.g., privilege-execute, bootstrap)
- `{{scope}}`: scope / environment
- `{{summary}}`: short summary string
- `{{result}}`: success | partial | fail
- `{{evidence}}`: JSON array of evidence paths
- `{{notes}}`: optional notes
