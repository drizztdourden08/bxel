/* @layer renderer-app @kind hook */
import { useCallback, useRef } from 'react';
import { isExpandable } from '../../../project-browser/is-expandable';
import { moveFocus } from '../../../project-browser/move-focus';
import { openItem } from '../../../project-browser/open-item';
import { TYPE_AHEAD_MS } from '../../../project-browser/project-browser.constants';
import { typeAhead } from '../../../project-browser/type-ahead';
import { NAV_KEYS } from '../ProjectPanel.constants';
import type { KeyboardEvent } from 'react';
import type { PanelParts, PickActions, TreeKeys } from '../ProjectPanel.type';

const useTreeKeys = ({ view, browser, selection, edit }: PanelParts, pick: PickActions): TreeKeys => {
  const typed = useRef({ text: '', at: 0 });
  const { rows } = browser;

  const navigate = useCallback(
    (event: KeyboardEvent<HTMLElement>, from: string) => {
      const move = moveFocus(rows, from, event.key);
      if (move.kind === 'none') return;
      event.preventDefault();
      if (move.kind === 'expand') view.setOpen([move.key], true);
      else if (move.kind === 'collapse') pick.toggle(move.key);
      else {
        if (event.shiftKey) selection.extend(move.key);
        else if (!event.ctrlKey) selection.choose([move.key]);
        selection.focusOn(move.key, true);
      }
    },
    [rows, view, pick, selection],
  );

  const letters = useCallback(
    (event: KeyboardEvent<HTMLElement>, from: string) => {
      const now = Date.now();
      typed.current = { text: now - typed.current.at > TYPE_AHEAD_MS ? event.key : typed.current.text + event.key, at: now };
      const found = typeAhead(rows, from, typed.current.text);
      if (found === null) return;
      selection.choose([found]);
      selection.focusOn(found, true);
    },
    [rows, selection],
  );

  const enter = useCallback(
    (from: string) => {
      const item = browser.itemOf(from);
      if (item === undefined) return;
      if (isExpandable(item)) pick.toggle(from);
      else for (const target of selection.keys.has(from) ? selection.targets : [item]) openItem(target);
    },
    [browser, pick, selection],
  );

  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const row = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-item-key]') : null;
      const from = row?.dataset.itemKey;
      if (edit.editing !== null || from === undefined || event.altKey || event.metaKey) return;
      if (NAV_KEYS.includes(event.key)) navigate(event, from);
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (event.key === ' ') selection.click(from, false, true);
        else enter(from);
      } else if (event.key.length === 1 && !event.ctrlKey) letters(event, from);
    },
    [edit.editing, navigate, letters, enter, selection],
  );
};

export { useTreeKeys };
