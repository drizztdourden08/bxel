/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { applyClick } from './apply-click';
import { NO_SELECTION } from './project-browser.constants';
import type { BrowserItem } from './project-browser.type';
import type { BrowserRows, RevealRequest, SelectionModel, SelectionState } from './browser-state.type';

const useBrowserSelection = (browser: BrowserRows): SelectionModel => {
  const { rows, itemOf } = browser;
  const [state, setState] = useState<SelectionState>(NO_SELECTION);
  const [request, setRequest] = useState<RevealRequest | null>(null);

  useEffect(() => {
    const live = [...state.keys].filter((key) => itemOf(key) !== undefined);
    if (live.length !== state.keys.size) setState((now) => ({ ...now, keys: new Set(live) }));
  }, [state.keys, itemOf]);

  const click = useCallback((key: string, shift: boolean, toggle: boolean) => setState((now) => applyClick({ selection: now, rows, key, shift, toggle })), [rows]);
  const focusOn = useCallback((key: string) => setState((now) => (now.focus === key ? now : { ...now, focus: key })), []);
  const reveal = useCallback((key: string, focus = false) => setRequest((now) => ({ key, serial: (now?.serial ?? 0) + 1, focus })), []);
  const choose = useCallback((keys: readonly string[]) => setState((now) => ({ keys: new Set(keys), anchor: keys[0] ?? now.anchor, focus: keys.at(-1) ?? now.focus })), []);
  const selectAll = useCallback(() => setState((now) => ({ ...now, keys: new Set(rows.filter((row) => row.item.role !== 'group').map((row) => row.item.key)) })), [rows]);
  const clear = useCallback(() => setState((now) => ({ ...now, keys: new Set() })), []);

  const targets = useMemo<readonly BrowserItem[]>(() => rows.filter((row) => state.keys.has(row.item.key)).map((row) => row.item), [rows, state.keys]);
  return { ...state, targets, request, click, focusOn, reveal, choose, selectAll, clear };
};

export { useBrowserSelection };
