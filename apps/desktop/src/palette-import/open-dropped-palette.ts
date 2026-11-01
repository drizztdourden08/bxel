/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import { readPaletteFile } from '../palette-source/read-palette-file';
import { usePaletteImportStore } from '../stores/usePaletteImportStore';

const openDroppedPalette = async (file: File, target: PaletteTarget): Promise<void> => {
  const read = readPaletteFile(new Uint8Array(await file.arrayBuffer()), file.name);
  if (!read.ok) {
    toast(read.message, { variant: 'warning' });
    return;
  }
  const source = { name: read.palette.name, colors: read.palette.colors };
  usePaletteImportStore.getState().open({ documentId: target.documentId, bankId: target.bank.id, source });
};

export { openDroppedPalette };
