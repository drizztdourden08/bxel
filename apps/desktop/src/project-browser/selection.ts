/* @layer renderer-app @kind logic */
type Selection = { readonly ids: readonly string[]; readonly anchor: string | null };

type Modifiers = { readonly ctrl: boolean; readonly shift: boolean };

const EMPTY_SELECTION: Selection = { ids: [], anchor: null };

const rangeBetween = (order: readonly string[], from: string, to: string): readonly string[] => {
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  if (start < 0 || end < 0) return [to];
  return order.slice(Math.min(start, end), Math.max(start, end) + 1);
};

/** Click, Ctrl and Shift click over the ids in the order they are shown. */
const pick = (current: Selection, id: string, order: readonly string[], keys: Modifiers): Selection => {
  if (keys.shift && current.anchor !== null) return { ids: rangeBetween(order, current.anchor, id), anchor: current.anchor };
  if (keys.ctrl) {
    const has = current.ids.includes(id);
    return { ids: has ? current.ids.filter((each) => each !== id) : [...current.ids, id], anchor: id };
  }
  return { ids: [id], anchor: id };
};

const pickAll = (order: readonly string[]): Selection => ({ ids: order, anchor: order[0] ?? null });

/** Drops ids that are no longer shown, so a refresh never leaves a ghost selected. */
const keepShown = (current: Selection, order: readonly string[]): Selection => {
  const shown = new Set(order);
  const ids = current.ids.filter((id) => shown.has(id));
  return ids.length === current.ids.length ? current : { ids, anchor: current.anchor !== null && shown.has(current.anchor) ? current.anchor : (ids[0] ?? null) };
};

export { EMPTY_SELECTION, keepShown, pick, pickAll };
export type { Modifiers, Selection };
