/* @layer renderer-app @kind logic */
import { decodeSource } from './decode-source';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImageRead } from './image-import.type';

const readImage = (bytes: Uint8Array, fileName: string): ImageRead => {
  try {
    const decoded = decodeSource(bytes);
    if (decoded === null) return { ok: false, message: IMPORT_TEXT.unreadable };
    return { ok: true, image: { fileName, ...decoded } };
  } catch {
    return { ok: false, message: IMPORT_TEXT.unreadable };
  }
};

export { readImage };
