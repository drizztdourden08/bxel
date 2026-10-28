/* @layer renderer-app @kind hook */
import { useCallback, useRef } from 'react';
import { isExpandable } from '../../../panel-browser/is-expandable';
import { openItem } from '../../../panel-browser/open-item';
import { SLOW_CLICK_MS } from '../../../panel-browser/project-browser.constants';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { PanelParts, PickActions, PickMods } from '../ProjectPanel.type';

const useRowPick = ({ view, browser, selection, edit }: PanelParts): PickActions => {
  const last = useRef({ key: '', at: 0 });

  const toggle = useCallback(
    (key: string) => {
      const item = browser.itemOf(key);
      if (item === undefined) return;
      if (item.role === 'group' && browser.mode === 'list') view.toggleGroup(key);
      else view.setOpen([key], !view.expandedSet.has(key));
    },
    [browser, view],
  );
  const open = useCallback((item: BrowserItem) => (isExpandable(item) ? toggle(item.key) : openItem(item)), [toggle]);
  const collapseAll = useCallback(() => view.setOpen([...view.expandedSet], false), [view]);

  const pick = useCallback(
    (item: BrowserItem, mods: PickMods) => {
      const plain = !mods.shift && !mods.toggle;
      const again = plain && selection.keys.size === 1 && selection.keys.has(item.key);
      const slow = again && last.current.key === item.key && Date.now() - last.current.at > SLOW_CLICK_MS && mods.detail === 1;
      last.current = { key: item.key, at: Date.now() };
      selection.click(item.key, mods.shift, mods.toggle);
      if (!plain) return;
      if (isExpandable(item)) {
        if (mods.detail <= 1) toggle(item.key);
      } else if (view.openOnClick) openItem(item);
      else if (slow && item.role !== 'ghost') edit.startRename(item.key);
    },
    [selection, view.openOnClick, toggle, edit],
  );

  return { pick, open, toggle, collapseAll };
};

export { useRowPick };
