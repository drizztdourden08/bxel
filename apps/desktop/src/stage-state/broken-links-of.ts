/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { HealthState, LinkFinding } from '../project-health/project-health.type';
import { NONE } from './broken-links-of.constants';
import { LINKED_TAB_KINDS, LINKED_TARGET_KINDS } from './stage-state.constants';

const brokenLinksOf = (health: HealthState, tabKind: string | null, path: string | undefined): readonly LinkFinding[] => {
  if (health.status !== 'ready' || path === undefined || tabKind === null || !LINKED_TAB_KINDS.includes(tabKind)) return NONE;
  const found = health.report.broken.filter(
    (finding) => isSamePath(finding.file, path) && finding.targetKind !== null && LINKED_TARGET_KINDS.includes(finding.targetKind),
  );
  return found.length === 0 ? NONE : found;
};

export { brokenLinksOf };
