/* @layer renderer-app @kind hook */
import type { DragEvent } from 'react';
import { useState } from 'react';
import type { PaletteTarget } from '../../../editor/editor.type';
import { droppedPaletteFile } from '../../../palette-import/dropped-palette-file';
import { openDroppedPalette } from '../../../palette-import/open-dropped-palette';
import type { PaletteDrop } from '../PalettePanel.type';

const hasFiles = (event: DragEvent): boolean => event.dataTransfer.types.includes('Files');

const usePaletteDrop = (target: PaletteTarget): PaletteDrop => {
  const [over, setOver] = useState(false);
  return {
    over,
    handlers: {
      onDragOver: (event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        setOver(false);
        if (!hasFiles(event)) return;
        event.preventDefault();
        const file = droppedPaletteFile(Array.from(event.dataTransfer.files));
        if (file) void openDroppedPalette(file, target);
      },
    },
  };
};

export { usePaletteDrop };
