/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { endEntryDrag, startEntryDrag } from '../../../sheet-manager/drag-payload';
import type { DragEntry } from '../../../sheet-manager/drag-payload.type';
import { entryId } from '../../../sheet-manager/entry-id';
import { nextPicks } from '../../../sheet-manager/pick-animation';
import { BROWSER_START } from '../EntryBrowser.constants';
import type { BrowserDrag, BrowserState, EntryBrowserProps } from '../EntryBrowser.type';
import { browseEntries } from './browse-entries';
import { defaultDragEntries } from './default-drag-entries';

interface EntryBrowserModel {
  state: BrowserState;
  patch: (change: Partial<BrowserState>) => void;
  shown: ReturnType<typeof browseEntries>;
  pick: (key: string, how: 'replace' | 'toggle' | 'range') => void;
  activate: (key: string) => void;
  dragFor: (key: string) => BrowserDrag;
}

const useEntryBrowser = ({ entries, picked, onPickedChange, onActivate, dragSource, dragEntries }: EntryBrowserProps): EntryBrowserModel => {
  const [state, setState] = useState<BrowserState>(BROWSER_START);
  const shown = useMemo(() => browseEntries(entries, state.query, state.kind), [entries, state.query, state.kind]);
  const order = useMemo(() => shown.map(entryId), [shown]);
  const pick = (key: string, how: 'replace' | 'toggle' | 'range'): void => onPickedChange(nextPicks(order, picked, key, how));
  const dragFor = (key: string): BrowserDrag => ({
    onDragStart: (event) => {
      const keys = picked.includes(key) ? picked : [key];
      const make = dragEntries ?? ((wanted: readonly string[]): readonly DragEntry[] => defaultDragEntries(entries, wanted));
      if (dragSource) startEntryDrag(event.dataTransfer, dragSource, make(keys));
    },
    onDragEnd: endEntryDrag,
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

export type { EntryBrowserModel };
export { useEntryBrowser };
