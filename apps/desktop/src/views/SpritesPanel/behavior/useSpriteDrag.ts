/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { DragEvent } from 'react';
import { carriesEntries, endEntryDrag, readEntries, startEntryDrag } from '../../../sheet-manager/drag-payload';
import type { DropSide, DropTarget } from '../../../sheet-manager/drag-payload.type';
import { dropEntries } from '../../../sheet-manager/drop-entries';
import { dragEntriesOf } from './drag-entries-of';
import { dragGhost } from './drag-ghost';
import type { ManagerModel, SpriteDragHandlers } from '../SpritesPanel.type';

interface EntryDrag {
  dragFor: (key: string) => SpriteDragHandlers;
  marks: ReadonlyMap<string, DropSide>;
  zone: Pick<SpriteDragHandlers, 'onDragOver' | 'onDrop' | 'onDragLeave'>;
}

const sideOf = (event: DragEvent<HTMLElement>): DropSide => {
  const box = event.currentTarget.getBoundingClientRect();
  return event.clientX < box.left + box.width / 2 ? 'before' : 'after';
};

const NO_MARKS: ReadonlyMap<string, DropSide> = new Map();

const useSpriteDrag = (model: ManagerModel | null): EntryDrag => {
  const [mark, setMark] = useState<{ key: string | null; side: DropSide } | null>(null);
  const sheetId = model?.sheet?.id ?? null;
  const accepts = (event: DragEvent<HTMLElement>): boolean => model !== null && sheetId !== null && carriesEntries(event.dataTransfer);
  const finish = (event: DragEvent<HTMLElement>, target: DropTarget): void => {
    event.preventDefault();
    event.stopPropagation();
    setMark(null);
    const entries = readEntries(event.dataTransfer);
    endEntryDrag();
    if (entries.length > 0) dropEntries(entries, target, sheetId);
  };
  const dragFor = (key: string): SpriteDragHandlers => ({
    onDragStart: (event) => {
      if (!model) return;
      const entries = dragEntriesOf(model, key);
      startEntryDrag(event.dataTransfer, 'sheet', entries);
      if (entries.length > 1) dragGhost(event.dataTransfer, entries.length);
    },
    onDragOver: (event) => {
      if (!accepts(event)) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      const side = sideOf(event);
      if (mark?.key !== key || mark.side !== side) setMark({ key, side });
    },
    onDragLeave: () => setMark((current) => (current?.key === key ? null : current)),
    onDragEnd: () => {
      setMark(null);
      endEntryDrag();
    },
    onDrop: (event) => {
      if (accepts(event)) finish(event, { key, side: sideOf(event) });
    },
  });
  const zone: EntryDrag['zone'] = {
    onDragOver: (event) => {
      if (!accepts(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    onDragLeave: () => setMark(null),
    onDrop: (event) => {
      if (accepts(event)) finish(event, { key: null, side: 'after' });
    },
  };
  return { dragFor, marks: mark?.key ? new Map([[mark.key, mark.side]]) : NO_MARKS, zone };
};

export type { EntryDrag };
export { useSpriteDrag };
