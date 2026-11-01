/* @layer renderer-app @kind logic */
import { descendantIds } from '@bxel/document';
import type { FlattenPlan, FlattenStep, PlanItem } from './flatten-group-plan.type';

const GROUP = 'group';

const flattenInside = (items: readonly PlanItem[], groupId: string, steps: FlattenStep[]): string | null => {
  const heads = items
    .filter((item) => item.parentId === groupId)
    .map((kid) => (kid.kind === GROUP ? flattenInside(items, kid.id, steps) : kid.id))
    .filter((id): id is string => id !== null);
  heads.slice(1).reverse().forEach((id) => steps.push({ op: 'merge', id }));
  steps.push({ op: 'ungroup', id: groupId });
  return heads[0] ?? null;
};

const flattenGroupPlan = (items: readonly PlanItem[], groupId: string): FlattenPlan | null => {
  if (items.find((item) => item.id === groupId)?.kind !== GROUP) return null;
  const inside = descendantIds(items, groupId);
  if (items.some((item) => inside.has(item.id) && item.kind === 'reference')) return null;
  const steps: FlattenStep[] = [];
  const keep = flattenInside(items, groupId, steps);
  return { steps, keep };
};

export { flattenGroupPlan };
