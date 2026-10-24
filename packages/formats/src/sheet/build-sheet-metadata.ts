/* @layer core @kind logic */
import type { ExportSheetInput, SheetCell } from './export-sheet.type';
import type { PackedSheet } from './sheet.type';
import type { SheetFrameEntry, SheetMetadata } from './sheet-metadata.type';

const frameEntries = (cells: readonly SheetCell[], packed: PackedSheet): SheetFrameEntry[][] => {
  const grouped: SheetFrameEntry[][] = [];
  cells.forEach((cell, i) => {
    const item = packed.items[i];
    if (!item) return;
    const { trimmed } = cell;
    const list = grouped[cell.spriteIndex] ?? [];
    list.push({
      box: { x: item.x, y: item.y, width: item.width, height: item.height },
      trimmed: trimmed.image.width !== trimmed.sourceWidth || trimmed.image.height !== trimmed.sourceHeight,
      sourceX: trimmed.offsetX,
      sourceY: trimmed.offsetY,
      durationMs: cell.durationMs,
    });
    grouped[cell.spriteIndex] = list;
  });
  return grouped;
};

const buildSheetMetadata = (
  input: ExportSheetInput,
  cells: readonly SheetCell[],
  packed: PackedSheet,
): SheetMetadata => {
  const grouped = frameEntries(cells, packed);
  return {
    image: input.imageName,
    width: packed.width,
    height: packed.height,
    scale: 1,
    sprites: input.sprites.map((sprite, i) => ({
      name: sprite.name,
      width: sprite.width,
      height: sprite.height,
      pivot: sprite.pivot,
      frames: grouped[i] ?? [],
      tags: sprite.tags,
      slices: sprite.slices,
    })),
  };
};

export { buildSheetMetadata };
