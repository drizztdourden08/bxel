/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { DragEvent } from 'react';
import type { AnimationId, SpriteId, TagId } from '@bxel/document';
import { animationKey } from '../../../sheet-manager/animation-key';
import { activeEntryDrag, endEntryDrag, readEntries } from '../../../sheet-manager/drag-payload';
import { removeEntries } from '../../../sheet-manager/remove-entries';
import type { ManagerModel } from '../SpritesPanel.type';

interface LibraryDrop {
  over: boolean;
  bind: {
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: () => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
}

/** A drop of sheet entries on the library takes them off the sheet; their files stay. */
const useLibraryDrop = (model: ManagerModel): LibraryDrop => {
  const [over, setOver] = useState(false);
  const accepts = (): boolean => activeEntryDrag()?.source === 'sheet' && model.sheet !== null;
  return {
    over,
    bind: {
      onDragOver: (event) => {
        if (!accepts()) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        if (!accepts()) return;
        event.preventDefault();
        setOver(false);
        const entries = readEntries(event.dataTransfer);
        endEntryDrag();
        const sprites = entries.filter((entry) => entry.kind === 'sprite').map((entry) => entry.assetId as SpriteId);
        const keys = entries.filter((entry) => entry.kind === 'animation').map((entry) => animationKey(entry.assetId as AnimationId, (entry.tagId ?? null) as TagId | null));
        removeEntries(sprites, keys, model.sheet?.id ?? null);
      },
    },
  };
};

export type { LibraryDrop };
export { useLibraryDrop };
