/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { FolderDrop } from '../ProjectBrowser.type';
import { hasAssetDrag } from './has-asset-drag';
import { hasFileDrag } from './has-file-drag';
import { readDragIds } from './read-drag-ids';
import { useBrowserContext } from './useBrowserContext';

const useFolderDrop = (folder: string | null, assets = true): FolderDrop => {
  const { actions, model } = useBrowserContext();
  const [over, setOver] = useState(false);
  const target = folder !== null && model.editable ? folder : null;
  const accepts = (event: Parameters<FolderDrop['handlers']['onDragOver']>[0]): boolean => (assets && hasAssetDrag(event)) || hasFileDrag(event);
  return {
    over: over && target !== null,
    handlers: {
      onDragOver: (event) => {
        if (target === null || !accepts(event)) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = hasFileDrag(event) ? 'copy' : 'move';
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        setOver(false);
        if (target === null || !accepts(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (hasFileDrag(event)) actions.dropFiles(Array.from(event.dataTransfer.files), target);
        else actions.moveInto(readDragIds(event), target);
      },
    },
  };
};

export { useFolderDrop };
