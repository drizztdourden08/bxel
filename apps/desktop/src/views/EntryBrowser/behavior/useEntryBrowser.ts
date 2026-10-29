/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { DragEntry, EntryDragSpec } from '../../../sheet-manager/drag-payload.type';
import { entryId } from '../../../sheet-manager/entry-id';
import { BROWSER_START } from '../EntryBrowser.constants';
import type { BrowserState, EntryBrowserProps } from '../EntryBrowser.type';
import type { EntryBrowserModel } from './useEntryBrowser.type';
import { browseEntries } from './browse-entries';
import { defaultDragEntries } from './default-drag-entries';
import { nextPicks } from '../../../sheet-manager/next-picks';

const useEntryBrowser = ({ entries, picked, onPickedChange, onActivate, dragSource, dragEntries }: EntryBrowserProps): EntryBrowserModel => {
  const [state, setState] = useState<BrowserState>(BROWSER_START);
  const shown = useMemo(() => browseEntries(entries, state.query, state.kind), [entries, state.query, state.kind]);
  const order = useMemo(() => shown.map(entryId), [shown]);
  const pick = (key: string, how: 'replace' | 'toggle' | 'range'): void => onPickedChange(nextPicks(order, picked, key, how));
  const dragFor = (key: string): EntryDragSpec => ({
    entries: () => {
      const keys = picked.includes(key) ? picked : [key];
      const make = dragEntries ?? ((wanted: readonly string[]): readonly DragEntry[] => defaultDragEntries(entries, wanted));
      return make(keys);
    },
    source: dragSource ?? 'library',
    disabled: dragSource === undefined,
  });
  return {
    state,
    patch: (change) => setState((current) => ({ ...current, ...change })),
    shown,
    pick,
    activate: (key) => onActivate?.(key),
    dragFor,
  };
};

export { useEntryBrowser };
