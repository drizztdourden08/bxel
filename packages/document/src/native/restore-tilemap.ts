/* @layer core @kind logic */
import type { MapLayer, Tilemap } from '../model/tilemap.type';
import { absentIssue } from './absent-issue';
import { bytesToCells } from './bytes-to-cells';
import { CELL_BYTES } from './container.constants';
import type { MapLayerJson, TilemapJson } from './document-json.type';
import type { EntryCheck } from './entry-check.type';
import { entryPaths } from './entry-paths';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';
import type { Parsed } from './parsed.type';

const failed = (issue: LoadIssue): Parsed<MapLayer> => ({ ok: false, issues: [issue] });

const restoreLayer = (shell: TilemapJson, layer: MapLayerJson, source: EntryCheck): Parsed<MapLayer> => {
  const path = entryPaths.tilemapLayer(layer.id);
  const bytes = source.good.get(path);
  if (!bytes) return failed(absentIssue(path, source.problems));
  if (bytes.length !== shell.columns * shell.rows * CELL_BYTES) {
    return failed(makeIssue(LOAD_ERROR.DOCUMENT_INVALID, `${path} does not match the map size.`, path));
  }
  return { ok: true, value: { ...layer, cells: bytesToCells(bytes) } };
};

const restoreTilemap = (shell: TilemapJson, source: EntryCheck): Parsed<Tilemap> => {
  const layers: MapLayer[] = [];
  const issues: LoadIssue[] = [];
  for (const layer of shell.layers) {
    const restored = restoreLayer(shell, layer, source);
    if (restored.ok) layers.push(restored.value);
    else issues.push(...restored.issues);
  }
  if (issues.length > 0) return { ok: false, issues };
  const { id, name, tilesetId, columns, rows } = shell;
  return { ok: true, value: { id, name, tilesetId, columns, rows, layers } };
};

export { restoreTilemap };
