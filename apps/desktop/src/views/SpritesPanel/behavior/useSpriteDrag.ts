/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { DropSide, EntryDragSpec } from '../../../sheet-manager/drag-payload.type';
import { dragEntriesOf } from './drag-entries-of';
import type { ManagerModel } from '../SpritesPanel.type';
import { NO_MARKS } from './useSpriteDrag.constants';
import type { EntryDrag } from './useSpriteDrag.type';

const useSpriteDrag = (model: ManagerModel | null): EntryDrag => {
  const [mark, setMark] = useState<{ key: string; side: DropSide } | null>(null);
  const dragFor = (key: string): EntryDragSpec => ({
    entries: () => (model ? dragEntriesOf(model, key) : []),
    source: 'sheet',
    disabled: model === null,
  });
  return { dragFor, marks: mark ? new Map([[mark.key, mark.side]]) : NO_MARKS, setMark };
};

export { useSpriteDrag };
