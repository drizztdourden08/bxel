/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { Tilemap } from '@bxel/document';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { runField } from './run-field';

const mapOf = (focus: AssetFocus): Tilemap | undefined => focusAssetOf(focus, 'tilemap');

const renameTileset = (focus: AssetFocus, value: unknown): AssetOutcome =>
  typeof value === 'string'
    ? runField(focus, ASSET_LABEL.rename, [{ name: COMMAND_NAME.tilesetUpdate, targets: null, options: { tileset: focus.key.id, name: value.trim() } }])
    : null;

const renameMap = (focus: AssetFocus, value: unknown): AssetOutcome =>
  typeof value === 'string'
    ? runField(focus, ASSET_LABEL.rename, [{ name: COMMAND_NAME.tilemapUpdate, targets: null, options: { tilemap: focus.key.id, name: value.trim() } }])
    : null;

const sideOf = (wanted: unknown, current: number): number | null => {
  if (wanted === undefined) return current;
  return typeof wanted === 'number' && Number.isInteger(wanted) ? wanted : null;
};

const resizeMap = (focus: AssetFocus, size: { columns?: unknown; rows?: unknown }): AssetOutcome => {
  const map = mapOf(focus);
  if (!map) return null;
  const columns = sideOf(size.columns, map.columns);
  const rows = sideOf(size.rows, map.rows);
  if (columns === null || rows === null || (columns === map.columns && rows === map.rows)) return null;
  return runField(focus, ASSET_LABEL.mapSize, [{ name: COMMAND_NAME.tilemapResize, targets: null, options: { tilemap: map.id, columns, rows } }]);
};

const TILESET_FIELDS: AssetFields = {
  'tileset.name': { read: (focus) => focusAssetOf(focus, 'tileset')?.name ?? '', write: renameTileset, buffered: true },
};

const TILEMAP_FIELDS: AssetFields = {
  'tilemap.name': { read: (focus) => mapOf(focus)?.name ?? '', write: renameMap, buffered: true },
  'tilemap.columns': { read: (focus) => mapOf(focus)?.columns ?? 0, write: (focus, value) => resizeMap(focus, { columns: value }), buffered: true },
  'tilemap.rows': { read: (focus) => mapOf(focus)?.rows ?? 0, write: (focus, value) => resizeMap(focus, { rows: value }), buffered: true },
};

export { TILEMAP_FIELDS, TILESET_FIELDS };
