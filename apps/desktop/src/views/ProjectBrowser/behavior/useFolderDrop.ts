/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { FolderDrop } from '../ProjectBrowser.type';
import { hasAssetDrag } from './has-asset-drag';
import { readDragIds } from './read-drag-ids';
import { useBrowserContext } from './useBrowserContext';

const useFolderDrop = (folder: string | null): FolderDrop => {
  const { actions, model } = useBrowserContext();
  const [over, setOver] = useState(false);
  const target = folder !== null && model.editable ? folder : null;
  return {
    over: over && target !== null,
    handlers: {
      onDragOver: (event) => {
        if (target === null || !hasAssetDrag(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        setOver(false);
        if (target === null || !hasAssetDrag(event)) return;
        event.preventDefault();
        actions.moveInto(readDragIds(event), target);
      },
    },
  };
};

export { useFolderDrop };
