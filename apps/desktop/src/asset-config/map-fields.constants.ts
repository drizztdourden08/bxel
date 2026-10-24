/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { OrientRequest, Tilemap } from '@bxel/document';
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

const orientMap = (focus: AssetFocus, patch: Partial<OrientRequest>): AssetOutcome => {
  const map = mapOf(focus);
  if (!map) return null;
  const now = map.orientation;
  const side = now && now.hexSideLength > 0 ? { hexSideLength: now.hexSideLength } : {};
  const orientation = { kind: now?.kind ?? 'orthogonal', ...(now ? { staggerAxis: now.staggerAxis, staggerIndex: now.staggerIndex } : {}), ...side, ...patch };
  return runField(focus, ASSET_LABEL.orientation, [{ name: COMMAND_NAME.tilemapOrient, targets: null, options: { tilemap: map.id, orientation } }]);
};

const TILESET_FIELDS: AssetFields = {
  'tileset.name': { read: (focus) => focusAssetOf(focus, 'tileset')?.name ?? '', write: renameTileset, buffered: true },
};

const TILEMAP_FIELDS: AssetFields = {
  'tilemap.name': { read: (focus) => mapOf(focus)?.name ?? '', write: renameMap, buffered: true },
  'tilemap.columns': { read: (focus) => mapOf(focus)?.columns ?? 0, write: (focus, value) => resizeMap(focus, { columns: value }), buffered: true },
  'tilemap.orientation': {
    read: (focus) => mapOf(focus)?.orientation?.kind ?? 'orthogonal',
    write: (focus, value) => (typeof value === 'string' ? orientMap(focus, { kind: value as OrientRequest['kind'], hexSideLength: undefined }) : null),
    buffered: false,
  },
  'tilemap.staggerAxis': {
    read: (focus) => mapOf(focus)?.orientation?.staggerAxis ?? 'y',
    write: (focus, value) => (value === 'x' || value === 'y' ? orientMap(focus, { staggerAxis: value }) : null),
    buffered: false,
  },
  'tilemap.staggerIndex': {
    read: (focus) => mapOf(focus)?.orientation?.staggerIndex ?? 'odd',
    write: (focus, value) => (value === 'odd' || value === 'even' ? orientMap(focus, { staggerIndex: value }) : null),
    buffered: false,
  },
  'tilemap.hexSide': {
    read: (focus) => mapOf(focus)?.orientation?.hexSideLength ?? 0,
    write: (focus, value) => (typeof value === 'number' && Number.isInteger(value) && value > 0 ? orientMap(focus, { hexSideLength: value }) : null),
    buffered: true,
  },
  'tilemap.rows': { read: (focus) => mapOf(focus)?.rows ?? 0, write: (focus, value) => resizeMap(focus, { rows: value }), buffered: true },
};

export { TILEMAP_FIELDS, TILESET_FIELDS };
