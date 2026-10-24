/* @layer renderer-app @kind logic */
import { planTiledImport, readTiledMap } from '@bxel/formats';
import type { ResolvedTileset } from '@bxel/formats';
import { fileName } from '../files/file-name';
import { readTilesetSource } from './read-tileset-source';
import { atlasColumns } from './atlas-columns';
import { tiledAtlas } from './tiled-atlas';
import { TILED_TEXT } from './tiled-import.constants';
import type { TiledFiles, TiledRead } from './tiled-import.type';

const readTiledFiles = async (documents: TiledFiles, path: string): Promise<TiledRead> => {
  const name = fileName(path);
  let text: string;
  try {
    text = await documents.readText(path);
  } catch {
    return { ok: false, message: TILED_TEXT.readFailed(name) };
  }
  const map = readTiledMap(text);
  if (!map.ok) return { ok: false, message: `${name}: ${map.message}` };
  const tilesets: ResolvedTileset[] = [];
  for (const ref of map.map.tilesets) {
    const resolved = await readTilesetSource(documents, ref, path);
    if (typeof resolved === 'string') return { ok: false, message: resolved };
    tilesets.push(resolved);
  }
  const plan = planTiledImport({ map: map.map, tilesets });
  if (!plan.ok) return { ok: false, message: `${name}: ${plan.message}` };
  if (plan.orientation !== 'orthogonal') return { ok: false, message: `${name}: ${TILED_TEXT.orthogonalOnly}` };
  return { ok: true, image: tiledAtlas(plan, name), tiled: { mapFile: name, plan, atlasColumns: atlasColumns(plan.tiles.length) } };
};

export { readTiledFiles };
