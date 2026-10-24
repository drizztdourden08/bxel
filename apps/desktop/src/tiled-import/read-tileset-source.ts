/* @layer renderer-app @kind logic */
import { readTiledTileset } from '@bxel/formats';
import type { ResolvedTileset, TiledTilesetRef } from '@bxel/formats';
import { fileName } from '../files/file-name';
import { joinRelative } from './join-relative';
import { readPngFile } from './read-png-file';
import { TILED_TEXT } from './tiled-import.constants';
import type { LoadedTileset as Loaded, TiledFiles } from './tiled-import.type';

const loadTileset = async (documents: TiledFiles, ref: TiledTilesetRef, mapPath: string): Promise<Loaded | string> => {
  if (ref.embedded) return { tileset: ref.embedded, home: mapPath };
  if (ref.source === null) return TILED_TEXT.missingTileset;
  const path = joinRelative(mapPath, ref.source);
  try {
    const read = readTiledTileset(await documents.readText(path));
    return read.ok ? { tileset: read.tileset, home: path } : `${fileName(path)}: ${read.message}`;
  } catch {
    return TILED_TEXT.readFailed(fileName(path));
  }
};

const readTileImages = async (documents: TiledFiles, loaded: Loaded): Promise<ReadonlyMap<number, ResolvedTileset['image']> | string> => {
  const images = new Map<number, ResolvedTileset['image']>();
  for (const tile of loaded.tileset.tiles) {
    if (!tile.image) continue;
    const image = await readPngFile(documents, joinRelative(loaded.home, tile.image.source));
    if (typeof image === 'string') return image;
    images.set(tile.id, image);
  }
  return images;
};

const readTilesetSource = async (documents: TiledFiles, ref: TiledTilesetRef, mapPath: string): Promise<ResolvedTileset | string> => {
  const loaded = await loadTileset(documents, ref, mapPath);
  if (typeof loaded === 'string') return loaded;
  const { tileset } = loaded;
  if (!tileset.image) {
    const collection = await readTileImages(documents, loaded);
    if (typeof collection === 'string') return collection;
    const tileImages = new Map([...collection].flatMap(([id, image]) => (image ? [[id, image] as const] : [])));
    return { firstGid: ref.firstGid, tileset, image: null, tileImages };
  }
  const image = await readPngFile(documents, joinRelative(loaded.home, tileset.image.source));
  return typeof image === 'string' ? image : { firstGid: ref.firstGid, tileset, image, tileImages: new Map() };
};

export { readTilesetSource };
