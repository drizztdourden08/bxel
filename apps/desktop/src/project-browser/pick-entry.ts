/* @layer renderer-app @kind logic */
import { rangeBetween } from './range-between';
import type { Modifiers, Selection } from './project-browser.type';

const pickEntry = (current: Selection, id: string, order: readonly string[], keys: Modifiers): Selection => {
  if (keys.shift && current.anchor !== null) return { ids: rangeBetween(order, current.anchor, id), anchor: current.anchor };
  if (!keys.ctrl) return { ids: [id], anchor: id };
  const has = current.ids.includes(id);
  return { ids: has ? current.ids.filter((each) => each !== id) : [...current.ids, id], anchor: id };
};

export { pickEntry };
