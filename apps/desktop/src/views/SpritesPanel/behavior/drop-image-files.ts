/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import { dropImage } from '../../../image-import/drop-image';
import { isImageFile } from '../../../image-import/is-image-file';

const dropImageFiles = (event: DragEvent<HTMLElement>): boolean => {
  if (!event.dataTransfer.types.includes('Files')) return false;
  event.preventDefault();
  const file = Array.from(event.dataTransfer.files).find(isImageFile);
  if (file) void dropImage(file);
  return true;
};

export { dropImageFiles };
