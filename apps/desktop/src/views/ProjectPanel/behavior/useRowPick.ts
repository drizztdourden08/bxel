/* @layer renderer-app @kind hook */
import { useCallback, useRef } from 'react';
import { isExpandable } from '../../../panel-browser/is-expandable';
import { openItem } from '../../../panel-browser/open-item';
import { openItemBackground } from '../../../panel-browser/open-item-background';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { PanelParts, PickActions, PickMods } from '../ProjectPanel.type';
import { focusRow } from './focus-row';

const useRowPick = ({ view, browser, selection }: PanelParts): PickActions => {
  const before = useRef<ReadonlySet<string>>(new Set());

  const toggle = useCallback(
    (key: string) => {
      const item = browser.itemOf(key);
      if (item === undefined) return;
      if (item.role === 'group') view.toggleGroup(key);
      else view.setOpen([key], !view.expandedSet.has(key));
    },
    [browser, view],
  );
  const open = useCallback((item: BrowserItem) => (isExpandable(item) ? toggle(item.key) : openItem(item)), [toggle]);
  const collapseAll = useCallback(() => view.replaceOpen([]), [view]);

  const pick = useCallback(
    (item: BrowserItem, mods: PickMods) => {
      selection.click(item.key, mods.shift, mods.toggle);
      if (mods.shift || mods.toggle) return;
      if (isExpandable(item)) toggle(item.key);
      else if (view.openOnClick) openItem(item);
    },
    [selection, view.openOnClick, toggle],
  );

  const picked = useCallback(
    (keys: ReadonlySet<string>) => {
      const fresh = [...keys].filter((key) => !before.current.has(key));
      before.current = keys;
      selection.choose([...keys]);
      const last = fresh.at(-1) ?? [...keys].at(-1);
      if (last !== undefined) focusRow(last);
      const only = keys.size === 1 && fresh.length === 1 ? browser.itemOf(fresh[0] ?? '') : undefined;
      if (view.openOnClick && only !== undefined && !isExpandable(only)) openItem(only);
    },
    [browser, selection, view.openOnClick],
  );

  return { pick, picked, open, openBackground: openItemBackground, toggle, collapseAll };
};

export { useRowPick };
