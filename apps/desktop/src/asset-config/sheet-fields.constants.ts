/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { Sheet, SheetLayout } from '@bxel/document';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome, GridPatch } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { runField } from './run-field';


const sheetOf = (focus: AssetFocus): Sheet | undefined => focusAssetOf(focus, 'sheet');

const gridOf = (sheet: Sheet): Extract<SheetLayout, { kind: 'grid' }> | null => (sheet.layout.kind === 'grid' ? sheet.layout : null);

const updateSheet = (focus: AssetFocus, options: object): AssetOutcome => {
  const sheet = sheetOf(focus);
  return sheet ? runField(focus, ASSET_LABEL.sheetStyle, [{ name: COMMAND_NAME.sheetUpdate, targets: null, options: { sheet: sheet.id, ...options } }]) : null;
};

const gridValue = (focus: AssetFocus, key: 'columns' | 'cellWidth' | 'cellHeight' | 'order') => {
  const sheet = sheetOf(focus);
  const grid = sheet ? gridOf(sheet) : null;
  return grid ? grid[key] : undefined;
};

const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null);

const gridPatch = (focus: AssetFocus, patch: GridPatch): AssetOutcome => {
  const sheet = sheetOf(focus);
  const keep = sheet ? gridOf(sheet) : null;
  if (!sheet || !keep) return null;
  return updateSheet(focus, { layout: { kind: 'grid', columns: keep.columns, cellWidth: keep.cellWidth, cellHeight: keep.cellHeight, order: keep.order, ...patch } });
};

const gridNumber = (key: 'columns' | 'cellWidth' | 'cellHeight') => (focus: AssetFocus, value: unknown): AssetOutcome => {
  const next = whole(value);
  return next === null || next < 1 ? null : gridPatch(focus, { [key]: next });
};

const setLayout = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const sheet = sheetOf(focus);
  if (!sheet || value === sheet.layout.kind) return null;
  if (value === 'manual') return updateSheet(focus, { layout: { kind: 'manual' } });
  return updateSheet(focus, { layout: value === 'packed' ? { kind: 'packed' } : { kind: 'grid' } });
};

const SHEET_FIELDS: AssetFields = {
  'sheet.name': {
    read: (focus) => sheetOf(focus)?.name ?? '',
    write: (focus, value) => (typeof value === 'string' ? updateSheet(focus, { name: value.trim() }) : null),
    buffered: true,
  },
  'sheet.layout': { read: (focus) => sheetOf(focus)?.layout.kind ?? 'manual', write: setLayout },
  'sheet.columns': { read: (focus) => gridValue(focus, 'columns') ?? 0, write: gridNumber('columns'), buffered: true },
  'sheet.cellWidth': { read: (focus) => gridValue(focus, 'cellWidth') ?? 0, write: gridNumber('cellWidth'), buffered: true },
  'sheet.cellHeight': { read: (focus) => gridValue(focus, 'cellHeight') ?? 0, write: gridNumber('cellHeight'), buffered: true },
  'sheet.order': {
    read: (focus) => gridValue(focus, 'order') ?? 'rows',
    write: (focus, value) => (value === 'rows' || value === 'columns' ? gridPatch(focus, { order: value }) : null),
  },
  'sheet.spacing': {
    read: (focus) => sheetOf(focus)?.spacing.x ?? 0,
    write: (focus, value) => {
      const next = whole(value);
      return next === null ? null : updateSheet(focus, { spacing: { x: next, y: next } });
    },
    buffered: true,
  },
  'sheet.margin': {
    read: (focus) => sheetOf(focus)?.margin ?? 0,
    write: (focus, value) => {
      const next = whole(value);
      return next === null ? null : updateSheet(focus, { margin: next });
    },
    buffered: true,
  },
};

export { SHEET_FIELDS };
