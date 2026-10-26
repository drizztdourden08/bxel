/* @layer core @kind logic */
import type { ExportSheetInput, SheetCell } from './export-sheet.type';
import type { PackedItem, PackedSheet } from './sheet.type';
import type { SheetFrameEntry, SheetMetadata } from './sheet-metadata.type';

const entryOf = (cell: SheetCell, item: PackedItem): SheetFrameEntry => {
  const { trimmed } = cell;
  return {
    box: { x: item.x, y: item.y, width: item.width, height: item.height },
    rotated: item.rotated,
    trimmed: trimmed.image.width !== trimmed.sourceWidth || trimmed.image.height !== trimmed.sourceHeight,
    sourceX: trimmed.offsetX,
    sourceY: trimmed.offsetY,
    durationMs: cell.durationMs,
    ...(cell.label === undefined ? {} : { label: cell.label }),
  };
};

const frameEntries = (cells: readonly SheetCell[], packed: PackedSheet): SheetFrameEntry[][] => {
  const grouped: SheetFrameEntry[][] = [];
  let next = 0;
  cells.forEach((cell) => {
    const list = grouped[cell.spriteIndex] ?? [];
    const item = cell.twin === undefined ? packed.items[next] : undefined;
    const twin = cell.twin === undefined ? undefined : list[cell.twin];
    if (cell.twin === undefined) next += 1;
    if (item) list.push(entryOf(cell, item));
    else if (twin) list.push({ ...twin, durationMs: cell.durationMs, ...(cell.label === undefined ? {} : { label: cell.label }) });
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
