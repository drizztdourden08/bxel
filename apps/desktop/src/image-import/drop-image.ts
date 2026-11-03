/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useImportStore } from '../stores/useImportStore';
import { readImage } from './read-image';

const dropImage = async (file: File, sheetId: string | null = null): Promise<void> => {
  if (useImportStore.getState().image !== null) return;
  const read = readImage(new Uint8Array(await file.arrayBuffer()), file.name);
  if (read.ok) useImportStore.getState().show(read.image, undefined, undefined, sheetId);
  else toast(read.message, { variant: 'warning' });
};

export { dropImage };
