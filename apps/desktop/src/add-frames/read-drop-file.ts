/* @layer renderer-app @kind logic */
import { isImageFile } from '../image-import/is-image-file';
import { readImage } from '../image-import/read-image';
import { DROP_TEXT } from './image-drop.constants';
import type { DropRead } from './image-drop.type';

const readDropFile = async (file: File): Promise<DropRead> => {
  if (!isImageFile(file)) return { ok: false, reason: DROP_TEXT.notImage(file.name) };
  try {
    const read = readImage(new Uint8Array(await file.arrayBuffer()), file.name);
    return read.ok ? { ok: true, image: read.image } : { ok: false, reason: DROP_TEXT.unreadable(file.name) };
  } catch {
    return { ok: false, reason: DROP_TEXT.unreadable(file.name) };
  }
};

export { readDropFile };
