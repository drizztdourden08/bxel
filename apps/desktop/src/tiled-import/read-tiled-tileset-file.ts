/* @layer renderer-app @kind logic */
import { readTiledTileset } from '@bxel/formats';
import { fileName } from '../files/file-name';
import { joinRelative } from './join-relative';
import { readPngFile } from './read-png-file';
import { TILED_TEXT } from './tiled-import.constants';
import type { TiledFiles, TilesetRead } from './tiled-import.type';

const readTiledTilesetFile = async (documents: TiledFiles, path: string): Promise<TilesetRead | { ok: false; message: string }> => {
  const name = fileName(path);
  let text: string;
  try {
    text = await documents.readText(path);
  } catch {
    return { ok: false, message: TILED_TEXT.readFailed(name) };
  }
  const read = readTiledTileset(text);
  if (!read.ok) return { ok: false, message: `${name}: ${read.message}` };
  const { tileset } = read;
  if (!tileset.image) return { ok: false, message: TILED_TEXT.collectionTileset(name) };
  const image = await readPngFile(documents, joinRelative(path, tileset.image.source));
  if (typeof image === 'string') return { ok: false, message: image };
  const grid = { cellWidth: tileset.tileWidth, cellHeight: tileset.tileHeight, offsetX: tileset.margin, offsetY: tileset.margin, spacingX: tileset.spacing, spacingY: tileset.spacing };
  return { ok: true, image: { ...image, fileName: name, grid }, tiled: null };
};

export { readTiledTilesetFile };
