/* @layer renderer-app @kind logic */
import type { PickHow, PickResult, PickState } from './pick-layer.type';

const between = (order: readonly string[], from: string, to: string): string[] => {
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  return start < 0 || end < 0 ? [to] : order.slice(Math.min(start, end), Math.max(start, end) + 1);
};

const only = (id: string): PickResult => ({ selected: [id], anchor: id, active: id });

const toggled = ({ selected, active }: PickState, id: string): PickResult => {
  if (!selected.includes(id)) return { selected: [...selected, id], anchor: id, active: id };
  if (selected.length === 1) return only(id);
  const rest = selected.filter((each) => each !== id);
  return { selected: rest, anchor: rest.at(-1) ?? null, active: active === id ? (rest.at(-1) ?? active) : active };
};

const pickLayer = (state: PickState, id: string, how: PickHow): PickResult => {
  if (how === 'toggle') return toggled(state, id);
  if (how !== 'range') return only(id);
  const from = state.anchor ?? state.active ?? id;
  return { selected: between(state.order, from, id), anchor: from, active: id };
};

export { pickLayer };
