/* @layer renderer-app @kind hook */
import type { ContextMenuPoint } from '@drizztdourden08/tessera';
import type { DragEvent, MouseEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { pickEntry } from '../../../project-browser/pick-entry';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { entryMenuGroups } from './entry-menu-groups';
import { writeDrag } from './write-drag';
import { useBrowserContext } from './useBrowserContext';

const useEntryHandlers = (entry: BrowserEntry) => {
  const { model, actions, selection, renaming } = useBrowserContext();
  const [point, setPoint] = useState<ContextMenuPoint | null>(null);
  const selected = selection.includes(entry.id);
  const picked = useMemo(() => (selected ? model.selected : [entry]), [selected, model.selected, entry]);
  const groups = useMemo(() => entryMenuGroups({ entry, picked, actions, editable: model.editable }), [entry, picked, actions, model.editable]);
  const closeMenu = useCallback(() => setPoint(null), []);
  return {
    selected,
    groups,
    point,
    closeMenu,
    renaming: renaming === entry.id,
    onClick: (event: MouseEvent): void => {
      const { selection: current, select } = useBrowserStore.getState();
      select(pickEntry(current, entry.id, model.order, { ctrl: event.ctrlKey || event.metaKey, shift: event.shiftKey }));
    },
    onDoubleClick: (): void => actions.open(entry),
    onContextMenu: (event: MouseEvent): void => {
      event.preventDefault();
      if (!selected) useBrowserStore.getState().select({ ids: [entry.id], anchor: entry.id });
      setPoint({ x: event.clientX, y: event.clientY });
    },
    onDragStart: (event: DragEvent): void => {
      if (!model.editable) {
        event.preventDefault();
        return;
      }
      writeDrag(event, picked);
    },
  };
};

export { useEntryHandlers };
