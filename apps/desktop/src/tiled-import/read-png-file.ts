/* @layer renderer-app @kind logic */
import { decodePng } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { fileName } from '../files/file-name';
import { TILED_TEXT } from './tiled-import.constants';
import type { TiledFiles } from './tiled-import.type';

const readPngFile = async (documents: TiledFiles, path: string): Promise<RgbaImage | string> => {
  try {
    const decoded = decodePng(await documents.read(path));
    return decoded.ok ? { data: decoded.data, width: decoded.width, height: decoded.height } : TILED_TEXT.imageFailed(fileName(path));
  } catch {
    return TILED_TEXT.readFailed(fileName(path));
  }
};

export { readPngFile };
