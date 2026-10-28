/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { DragEvent } from 'react';
import { hasAssetDrag, readDragIds } from './drag-payload';
import { useBrowserContext } from './browser-context';

type FolderDrop = {
  readonly over: boolean;
  readonly handlers: {
    readonly onDragOver: (event: DragEvent) => void;
    readonly onDragLeave: () => void;
    readonly onDrop: (event: DragEvent) => void;
  };
};

/** Makes an element a drop target that moves the dragged files into a folder. Nothing can move in a closed project. */
const useFolderDrop = (folder: string | null): FolderDrop => {
  const { actions, model } = useBrowserContext();
  const [over, setOver] = useState(false);
  const live = folder !== null && model.editable;
  return {
    over: over && live,
    handlers: {
      onDragOver: (event) => {
        if (!live || !hasAssetDrag(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        setOver(false);
        if (!live || !hasAssetDrag(event) || folder === null) return;
        event.preventDefault();
        actions.moveInto(readDragIds(event), folder);
      },
    },
  };
};

export { useFolderDrop };
