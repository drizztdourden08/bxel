/* @layer renderer-app @kind logic */
import { isImageFile } from '../image-import/is-image-file';
import { DROP_PALETTE_EXTENSIONS } from './file-ops.constants';
import type { DropKind } from './file-ops.type';

const dropKind = (file: File): DropKind => {
  if (isImageFile(file)) return 'image';
  const name = file.name.toLowerCase();
  return DROP_PALETTE_EXTENSIONS.some((extension) => name.endsWith(extension)) ? 'palette' : 'copy';
};

export { dropKind };
