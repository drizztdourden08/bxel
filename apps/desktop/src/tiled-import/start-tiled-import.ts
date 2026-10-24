/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { useImportStore } from '../stores/useImportStore';
import { pickTiledFile } from './pick-tiled-file';
import { TILED_TEXT } from './tiled-import.constants';

const startTiledImport = async (): Promise<void> => {
  const documents = getPlatform().documents;
  if (!documents) {
    toast(TILED_TEXT.unavailable, { variant: 'info' });
    return;
  }
  const read = await pickTiledFile(documents);
  if (read === null) return;
  if (read.ok) useImportStore.getState().show(read.image, read.tiled);
  else toast(read.message, { variant: 'warning' });
};

export { startTiledImport };
