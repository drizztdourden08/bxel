/* @layer renderer-app @kind logic */
type PickHow = 'replace' | 'toggle' | 'range';

interface PickState {
  order: readonly string[];
  selected: readonly string[];
  anchor: string | null;
  active: string | null;
}

interface PickResult {
  selected: readonly string[];
  anchor: string | null;
  active: string | null;
}

const between = (order: readonly string[], from: string, to: string): string[] => {
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  return start < 0 || end < 0 ? [to] : order.slice(Math.min(start, end), Math.max(start, end) + 1);
};

/** What a click on a row picks: this row alone, this row added or taken out, or every row from the anchor to this one. */
const pickLayer = (state: PickState, id: string, how: PickHow): PickResult => {
  const { order, selected, active } = state;
  if (how === 'range') {
    const from = state.anchor ?? active ?? id;
    return { selected: between(order, from, id), anchor: from, active: id };
  }
  if (how === 'toggle' && selected.includes(id) && selected.length > 1) {
    const rest = selected.filter((each) => each !== id);
    return { selected: rest, anchor: rest.at(-1) ?? null, active: active === id ? (rest.at(-1) ?? active) : active };
  }
  if (how === 'toggle' && !selected.includes(id)) return { selected: [...selected, id], anchor: id, active: id };
  return { selected: [id], anchor: id, active: id };
};

export { pickLayer };
export type { PickHow };
