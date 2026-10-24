/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { flattenTilemap } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { canvasMapper } from './support/canvas-mapper';
import { drawStroke } from './support/draw-stroke';
import { exportTilemap } from './support/export-tilemap';
import { openTilemapRig } from './support/open-tilemap-rig';
import { pickSwatch } from './support/pick-swatch';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { switchTileMode } from './support/switch-tile-mode';
import { TILEMAP_E2E } from './support/tilemap.constants';
import { useRig } from './support/use-rig';

const { columns, tile, cells, edited, stroke } = TILEMAP_E2E;

describe('check 8: editing a tile changes every placement of it', () => {
  const rig = useRig(openTilemapRig);

  test('places a tile twice, edits the tile, and both placements show the new pixels', async () => {
    const { session, mapper } = rig();
    const map = await mapper();
    const centre = (cell: { x: number; y: number }) => ({ x: cell.x * tile + tile / 2, y: cell.y * tile + tile / 2 });
    for (const cell of cells) await drawStroke(session, map, [centre(cell)]);
    await switchTileMode(session, 'Edit Tile');
    const tilePixels = await canvasMapper(session, { width: tile, height: tile });
    await pickSwatch(session, edited);
    await drawStroke(session, tilePixels, stroke);
    await switchTileMode(session, 'Place Tile');
    const path = join(session.dir, TILEMAP_E2E.file);
    await saveFile(session, path, [join(session.dir, 'tiles.bxtiles')]);
    const saved = readSaved(path);
    const map0 = saved.tilemaps[0];
    const tileset = saved.tilesets[0];
    if (!map0 || !tileset) throw new Error('the saved file has no map');
    const placed = Array.from(map0.layers[0]?.cells ?? []).flatMap((cell, at) => (cell === 0 ? [] : [{ key: cell, at }]));
    expect(placed.map((item) => item.at)).toEqual(cells.map((cell) => cell.y * columns + cell.x));
    expect(placed.every((item) => item.key === 2)).toBe(true);
    const flat = flattenTilemap(saved, map0.id);
    const width = columns * tile;
    for (const cell of cells) {
      for (const point of stroke) expect(flat.pixels[(cell.y * tile + point.y) * width + cell.x * tile + point.x]).toBe(edited);
    }
    expect(flat.pixels.filter((index) => index !== 0)).toHaveLength(cells.length * stroke.length);
  });

  test('keeps the tile ids after the edit and writes no dangling tile id', async () => {
    const { session } = rig();
    const bxel = JSON.parse(await exportTilemap(session, 'Bxel map JSON')) as { tileset: { tiles: { key: number }[] }; layers: { keys: number[] }[] };
    const keys = new Set(bxel.tileset.tiles.map((item) => item.key));
    expect([...keys]).toEqual([1, 2]);
    for (const key of bxel.layers.flatMap((layer) => layer.keys)) expect(key === 0 || keys.has(key)).toBe(true);
    const tiled = JSON.parse(await exportTilemap(session, 'Tiled JSON')) as { orientation: string; layers: { data: number[] }[] };
    expect(tiled.orientation).toBe('orthogonal');
    expect(tiled.layers[0]?.data.filter((gid) => gid !== 0)).toEqual([2, 2]);
  });
});
