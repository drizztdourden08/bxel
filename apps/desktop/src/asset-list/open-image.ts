/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { readImage } from '../image-import/read-image';
import { useImportStore } from '../stores/useImportStore';

const openImage = async (path: string): Promise<void> => {
  const { documents } = getPlatform();
  if (!documents) return;
  const read = readImage(await documents.read(path), fileName(path));
  if (read.ok) useImportStore.getState().show(read.image);
  else toast(read.message, { variant: 'warning' });
};

export { openImage };
