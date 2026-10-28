/* @layer renderer-app @kind logic */
import type { Selection } from './project-browser.type';

const keepShown = (current: Selection, order: readonly string[]): Selection => {
  const shown = new Set(order);
  const ids = current.ids.filter((id) => shown.has(id));
  if (ids.length === current.ids.length) return current;
  return { ids, anchor: current.anchor !== null && shown.has(current.anchor) ? current.anchor : (ids[0] ?? null) };
};

export { keepShown };
