/* @layer renderer-app @kind logic */
import { rangeKeys } from './range-keys';
import type { ClickInput, SelectionState } from './browser-state.type';

const applyClick = ({ selection, rows, key, shift, toggle }: ClickInput): SelectionState => {
  if (shift && selection.anchor !== null) {
    const range = rangeKeys(rows, selection.anchor, key);
    return { keys: toggle ? new Set([...selection.keys, ...range]) : new Set(range), anchor: selection.anchor, focus: key };
  }
  if (toggle) {
    const keys = new Set(selection.keys);
    if (keys.has(key)) keys.delete(key);
    else keys.add(key);
    return { keys, anchor: key, focus: key };
  }
  return { keys: new Set([key]), anchor: key, focus: key };
};

export { applyClick };
