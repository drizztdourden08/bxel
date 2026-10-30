/* @layer core @kind logic */
import type { OrderMove } from './order-move.type';

const movedOrder = <T>(items: readonly T[], isMoved: (item: T) => boolean, move: OrderMove): readonly T[] => {
  const group = items.filter(isMoved);
  const rest = items.filter((item) => !isMoved(item));
  const first = items.findIndex(isMoved);
  const before = items.slice(0, Math.max(0, first)).filter((item) => !isMoved(item)).length;
  const at = Math.min(rest.length, Math.max(0, move.to ?? before + (move.by ?? 0)));
  return [...rest.slice(0, at), ...group, ...rest.slice(at)];
};

export { movedOrder };
