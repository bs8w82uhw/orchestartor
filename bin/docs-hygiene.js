#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const REGISTRY_FILE = path.join(DOCS_DIR, 'knowledge-registry.json');
const REPORT_FILE = path.join(ROOT, 'docs-hygiene-report.md');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listDocs() {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => `docs/${f}`)
    .sort();
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '');
}

function main() {
  const now = new Date().toISOString().slice(0, 10);
  const docs = listDocs();
  const registry = readJson(REGISTRY_FILE);
  const map = new Map((registry.items || []).map((i) => [i.path, i]));

  const missingEntries = docs.filter((p) => !map.has(p));
  const orphanEntries = [...map.keys()].filter((p) => !docs.includes(p));
  const invalidMetadata = [];
  const reviewExpired = [];

  for (const docPath of docs) {
    const item = map.get(docPath);
    if (!item) continue;

    const problems = [];
    if (!item.owner) problems.push('missing owner');
    if (!['draft', 'active', 'deprecated'].includes(item.status)) problems.push('invalid status');
    if (!isIsoDate(item.last_reviewed_at)) problems.push('invalid last_reviewed_at');
    if (!isIsoDate(item.next_review_at)) problems.push('invalid next_review_at');
    if (typeof item.agent_ready !== 'boolean') problems.push('agent_ready must be boolean');
    if (!['low', 'medium', 'high'].includes(item.risk_level)) problems.push('invalid risk_level');
    if (problems.length) invalidMetadata.push({ docPath, problems });

    if (isIsoDate(item.next_review_at) && item.next_review_at < now) {
      reviewExpired.push({ docPath, next_review_at: item.next_review_at, owner: item.owner || 'unassigned' });
    }
  }

  const lines = [];
  lines.push('# Docs Hygiene Report');
  lines.push('');
  lines.push(`- Generated at: ${now}`);
  lines.push(`- Docs scanned: ${docs.length}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Missing registry entries: ${missingEntries.length}`);
  lines.push(`- Orphan registry entries: ${orphanEntries.length}`);
  lines.push(`- Invalid metadata entries: ${invalidMetadata.length}`);
  lines.push(`- Expired review dates: ${reviewExpired.length}`);
  lines.push('');

  if (missingEntries.length) {
    lines.push('## Missing Registry Entries');
    lines.push('');
    missingEntries.forEach((x) => lines.push(`- ${x}`));
    lines.push('');
  }

  if (orphanEntries.length) {
    lines.push('## Orphan Registry Entries');
    lines.push('');
    orphanEntries.forEach((x) => lines.push(`- ${x}`));
    lines.push('');
  }

  if (invalidMetadata.length) {
    lines.push('## Invalid Metadata');
    lines.push('');
    invalidMetadata.forEach((x) => lines.push(`- ${x.docPath}: ${x.problems.join(', ')}`));
    lines.push('');
  }

  if (reviewExpired.length) {
    lines.push('## Expired Reviews');
    lines.push('');
    reviewExpired.forEach((x) => lines.push(`- ${x.docPath} (owner: ${x.owner}, next_review_at: ${x.next_review_at})`));
    lines.push('');
  }

  if (
    !missingEntries.length &&
    !orphanEntries.length &&
    !invalidMetadata.length &&
    !reviewExpired.length
  ) {
    lines.push('## Result');
    lines.push('');
    lines.push('- All checks passed.');
    lines.push('');
  }

  fs.writeFileSync(REPORT_FILE, lines.join('\n'));
  console.log(`Report written: ${path.relative(ROOT, REPORT_FILE)}`);
}

main();
