---
title: Method Template
---

## Method ID

`METHOD-<DOMAIN>-<NAME>`

## Location

- File:
- Class:
- Method:

## Purpose

What business/technical outcome this method guarantees.

## Contract

### Inputs

- Input fields and types
- Preconditions

### Outputs

- Return payload
- Side effects

### Errors

- Error cases
- Error format

## Policy / Security

- Risk level:
- Required approval:
- Privilege requirements:

## Observability

- Logs emitted:
- Metrics updated:
- Trace / audit artifacts:

## Test Cases

### Test Mode Matrix

| Scenario | Autonomous Test | Manual Test |
|---------|------------------|-------------|
| Happy path | [ ] | [ ] |
| Invalid input | [ ] | [ ] |
| Policy denied | [ ] | [ ] |
| Edge case | [ ] | [ ] |

### Autonomous Test Notes

- Test harness / script:
- Input fixture:
- Expected assertions:

### Manual Test Notes

- UI/API flow steps:
- Human validation checkpoints:
- Expected operator decisions:

- Happy path:
- Invalid input:
- Policy denied:
- Edge cases:

## Debug Checklist

1. Validate preconditions.
2. Validate policy decision.
3. Validate output contract.
4. Validate side effects.
5. Validate logs and audit artifacts.
