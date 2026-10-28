/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import type { Draft } from './tidy-menu.type';

const pruned = (entry: MenuEntry): MenuEntry | null => {
  if (entry === 'separator' || entry.children === undefined) return entry;
  const children = tidyMenu(entry.children);
  return children.length === 0 ? null : { ...entry, children };
};

const tidyMenu = (drafts: readonly Draft[]): MenuEntry[] => {
  const result: MenuEntry[] = [];
  for (const draft of drafts) {
    const entry = draft === null || draft === false ? null : pruned(draft);
    if (entry === null) continue;
    if (entry === 'separator' && (result.length === 0 || result[result.length - 1] === 'separator')) continue;
    result.push(entry);
  }
  if (result[result.length - 1] === 'separator') result.pop();
  return result;
};

export { tidyMenu };
