/* @layer renderer-app @kind logic */
import { decodePng } from '@bxel/formats';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImageRead } from './image-import.type';

const readImage = (bytes: Uint8Array, fileName: string): ImageRead => {
  try {
    const decoded = decodePng(bytes);
    if (!decoded.ok) return { ok: false, message: IMPORT_TEXT.unreadable };
    return { ok: true, image: { fileName, width: decoded.width, height: decoded.height, data: decoded.data } };
  } catch {
    return { ok: false, message: IMPORT_TEXT.unreadable };
  }
};

export { readImage };
