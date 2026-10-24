/* @layer core @kind logic */
import type { Tileset } from '../model/tilemap.type';
import { absentIssue } from './absent-issue';
import { bytesToCells } from './bytes-to-cells';
import { clearBrokenCells } from './clear-broken-cells';
import { CELL_BYTES } from './container.constants';
import type { TilemapJson } from './document-json.type';
import type { EntryCheck } from './entry-check.type';
import { entryPaths } from './entry-paths';
import { LOAD_ERROR } from './load-error.constants';
import type { DamagedMapLayer, LoadIssue } from './load-report.type';
import type { LayerContext, RestoredLayer, RestoredTilemap } from './restored-tilemap.type';

const blank = ({ shell, layer }: LayerContext, issue: LoadIssue): RestoredLayer => ({
  layer: { ...layer, cells: new Uint32Array(shell.columns * shell.rows) },
  damage: { tilemapId: shell.id, layerId: layer.id, code: issue.code, message: issue.message },
});

const brokenDamage = ({ shell, layer }: LayerContext, lost: readonly number[]): DamagedMapLayer => ({
  tilemapId: shell.id,
  layerId: layer.id,
  code: LOAD_ERROR.REFERENCE_BROKEN,
  message: `${lost.length} cells of layer "${layer.name}" name tile key ${lost[0]} or others that no tile has. They were cleared.`,
});

const restoreLayer = (context: LayerContext): RestoredLayer => {
  const { shell, layer, keys, source } = context;
  const path = entryPaths.tilemapLayer(layer.id);
  const bytes = source.good.get(path);
  if (!bytes) return blank(context, absentIssue(path, source.problems));
  if (bytes.length !== shell.columns * shell.rows * CELL_BYTES) {
    return blank(context, { code: LOAD_ERROR.DOCUMENT_INVALID, message: `${path} does not match the map size.`, path });
  }
  const cells = bytesToCells(bytes);
  const lost = clearBrokenCells(cells, keys);
  return { layer: { ...layer, cells }, damage: lost.length > 0 ? brokenDamage(context, lost) : null };
};

const restoreTilemap = (shell: TilemapJson, tileset: Tileset, source: EntryCheck): RestoredTilemap => {
  const keys = new Set(tileset.tiles.map((tile) => tile.key));
  const restored = shell.layers.map((layer) => restoreLayer({ shell, layer, keys, source }));
  const { id, name, tilesetId, columns, rows } = shell;
  return {
    tilemap: { id, name, tilesetId, columns, rows, layers: restored.map((item) => item.layer) },
    damage: restored.flatMap((item) => (item.damage ? [item.damage] : [])),
  };
};

export { restoreTilemap };
