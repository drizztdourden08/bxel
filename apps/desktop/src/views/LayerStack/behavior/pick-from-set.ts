/* @layer renderer-app @kind logic */
import type { PickResult, PickState } from './pick-layer.type';

const clickedEnd = (ordered: readonly string[], added: readonly string[], active: string | null): string | null => {
  const first = ordered[0];
  const last = ordered.at(-1);
  if (active !== null && active === first) return last ?? null;
  if (active !== null && active === last) return first ?? null;
  return added.at(-1) ?? null;
};

const keepActive = (state: PickState, ordered: readonly string[]): PickResult => {
  const stays = state.active !== null && ordered.includes(state.active);
  return { selected: ordered, anchor: state.anchor, active: stays ? state.active : (ordered.at(-1) ?? null) };
};

const growSelection = (state: PickState, ordered: readonly string[], added: readonly string[]): PickResult => {
  const only = added.length === 1;
  const active = only ? (added[0] ?? null) : clickedEnd(ordered, added, state.active);
  return { selected: ordered, anchor: only ? active : (state.anchor ?? state.active), active };
};

const pickFromSet = (state: PickState, keys: ReadonlySet<string>): PickResult | null => {
  const ordered = state.order.filter((id) => keys.has(id));
  if (ordered.length === 0) return null;
  const added = ordered.filter((id) => !state.selected.includes(id));
  if (ordered.length === 1) return { selected: ordered, anchor: ordered[0] ?? null, active: ordered[0] ?? null };
  return added.length === 0 ? keepActive(state, ordered) : growSelection(state, ordered, added);
};

export { pickFromSet };
