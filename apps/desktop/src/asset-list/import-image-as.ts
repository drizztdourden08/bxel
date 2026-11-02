/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import type { ImportKind } from '../image-import/image-import.type';
import { readImage } from '../image-import/read-image';
import { useImportStore } from '../stores/useImportStore';

const importImageAs = async (path: string, kind: ImportKind): Promise<void> => {
  const { documents } = getPlatform();
  if (!documents) return;
  const read = readImage(await documents.read(path), fileName(path));
  if (read.ok) useImportStore.getState().show(read.image, undefined, kind);
  else toast(read.message, { variant: 'warning' });
};

export { importImageAs };
