/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import type { HealthState } from '../project-health/project-health.type';
import { toSlashes } from '../workspace/to-slashes';
import type { BrowserFacts } from './project-browser.type';

const withHealthFlags = (facts: ReadonlyMap<string, BrowserFacts>, rows: readonly AssetRow[], health: HealthState): ReadonlyMap<string, BrowserFacts> => {
  if (health.status !== 'ready') return facts;
  const broken = new Set(health.report.broken.map((finding) => toSlashes(finding.file)));
  const misplaced = new Set(health.report.misplaced.map((finding) => toSlashes(finding.path)));
  if (broken.size === 0 && misplaced.size === 0) return facts;
  const merged = new Map(facts);
  for (const row of rows) {
    const found = merged.get(row.id);
    const path = toSlashes(row.path);
    if (found && (broken.has(path) || misplaced.has(path))) merged.set(row.id, { ...found, broken: broken.has(path), misplaced: misplaced.has(path) });
  }
  return merged;
};

export { withHealthFlags };
