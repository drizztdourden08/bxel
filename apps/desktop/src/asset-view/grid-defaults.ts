/* @layer renderer-app @kind logic */
import type { Sheet, Size, Tileset } from '@bxel/document';
import type { AssetGridDefaults } from './asset-view.type';
import type { GridInput } from './grid-defaults.type';

const tileOf = (tileset: Tileset): Size => ({ width: tileset.tileWidth, height: tileset.tileHeight });

const sheetCell = (sheet: Sheet | null): Size | null =>
  sheet?.layout.kind === 'grid' ? { width: sheet.layout.cellWidth, height: sheet.layout.cellHeight } : null;

const gridDefaults = ({ surface, tileset, sheet, setting }: GridInput): AssetGridDefaults => {
  if ((surface === 'map' || surface === 'tile') && tileset) return { tile: tileOf(tileset), source: surface === 'map' ? 'map' : 'tileset' };
  const cell = surface === 'sheet' ? sheetCell(sheet) : null;
  if (cell) return { tile: cell, source: 'sheet' };
  return { tile: { width: setting, height: setting }, source: 'setting' };
};

export { gridDefaults };
