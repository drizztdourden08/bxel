/* @layer renderer-app @kind hook */
import type { ContextMenuPoint } from '@drizztdourden08/tessera';
import type { MouseEvent, RefObject } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { pickEntry } from '../../../project-browser/pick-entry';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { MIDDLE_BUTTON } from '../ProjectBrowser.constants';
import { entryMenuGroups } from './entry-menu-groups';
import { useBrowserContext } from './useBrowserContext';
import { useEntryDragOut } from './useEntryDragOut';

const useEntryHandlers = (entry: BrowserEntry, ref: RefObject<HTMLElement | null>) => {
  const { model, actions, selection, renaming } = useBrowserContext();
  const [point, setPoint] = useState<ContextMenuPoint | null>(null);
  const selected = selection.includes(entry.id);
  const picked = useMemo(() => (selected ? model.selected : [entry]), [selected, model.selected, entry]);
  const groups = useMemo(() => entryMenuGroups({ entry, picked, actions, editable: model.editable, collections: model.organise.collections }), [entry, picked, actions, model.editable, model.organise.collections]);
  const closeMenu = useCallback(() => setPoint(null), []);
  useEntryDragOut(ref, { picked, disabled: !model.editable || renaming === entry.id });
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
    onMouseDown: (event: MouseEvent): void => {
      if (event.button === MIDDLE_BUTTON) event.preventDefault();
    },
    onAuxClick: (event: MouseEvent): void => {
      if (event.button !== MIDDLE_BUTTON) return;
      event.preventDefault();
      actions.openBackground(entry);
    },
    onContextMenu: (event: MouseEvent): void => {
      event.preventDefault();
      if (!selected) useBrowserStore.getState().select({ ids: [entry.id], anchor: entry.id });
      setPoint({ x: event.clientX, y: event.clientY });
    },
  };
};

export { useEntryHandlers };
