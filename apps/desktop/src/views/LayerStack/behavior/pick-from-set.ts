/* @layer renderer-app @kind logic */
import type { PickResult, PickState } from './pick-layer.type';

const clickedEnd = (ordered: readonly string[], added: readonly string[], active: string | null): string | null => {
  const first = ordered[0];
  const last = ordered.at(-1);
  if (active !== null && active === first) return last ?? null;
  if (active !== null && active === last) return first ?? null;
  return added.at(-1) ?? null;
};

const pickFromSet = (state: PickState, keys: ReadonlySet<string>): PickResult | null => {
  const ordered = state.order.filter((id) => keys.has(id));
  if (ordered.length === 0) return null;
  const added = ordered.filter((id) => !state.selected.includes(id));
  if (ordered.length === 1) return { selected: ordered, anchor: ordered[0] ?? null, active: ordered[0] ?? null };
  if (added.length === 0) {
    const active = state.active !== null && ordered.includes(state.active) ? state.active : (ordered.at(-1) ?? null);
    return { selected: ordered, anchor: state.anchor, active };
  }
  const active = added.length === 1 ? (added[0] ?? null) : clickedEnd(ordered, added, state.active);
  const anchor = added.length === 1 ? active : (state.anchor ?? state.active);
  return { selected: ordered, anchor, active };
};

export { pickFromSet };
