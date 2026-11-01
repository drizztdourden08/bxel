/* @layer renderer-app @kind logic */
import type { PlanItem } from './flatten-group-plan.type';
import { outdentWish } from './outdent-wish';
import type { TreeMoveWish } from './tree-move-plan.type';

const moveOutWish = (layers: readonly PlanItem[], ids: readonly string[]): TreeMoveWish | null => {
  const topFirst = [...layers].reverse();
  const lead = topFirst.find((item) => ids.includes(item.id) && item.parentId !== undefined);
  const wish = lead ? outdentWish(topFirst, lead.id) : null;
  if (!lead || !wish) return null;
  const keys = topFirst.filter((item) => ids.includes(item.id) && item.parentId === lead.parentId).map((item) => item.id);
  return { ...wish, keys };
};

export { moveOutWish };
