/* @layer renderer-app @kind logic */
import type { PackedItem, PackedPage, SheetCell } from '@bxel/formats';
import { sheetAnimationItems } from '../sheet/sheet-animation-items';
import type { AtlasPage, PlannedAtlas } from './atlas-page.type';
import type { AtlasAnimation, AtlasInput, AtlasItem } from './manager.type';
import { stripImages } from './strip-images';

const sourceOf = (cell: SheetCell) => {
  const { image, offsetX, offsetY } = cell.trimmed;
  return { x: offsetX, y: offsetY, width: image.width, height: image.height };
};

const itemOfCell = (planned: PlannedAtlas, cell: SheetCell, own: PackedItem): AtlasItem | null => {
  const sprite = planned.targets[cell.spriteIndex]?.sprite;
  if (!sprite) return null;
  const { x, y, width, height, rotated } = own;
  return { id: sprite.id, name: sprite.name, frame: cell.frameIndex, x, y, width, height, rotated, pivot: sprite.pivot, source: sourceOf(cell) };
};

const stripOfCell = (planned: PlannedAtlas, strips: readonly (readonly AtlasAnimation['images'][number][])[], cell: SheetCell, own: PackedItem): AtlasAnimation | null => {
  const at = cell.spriteIndex - planned.targets.length;
  const image = strips[at]?.[cell.frameIndex];
  const name = planned.extra[at]?.name;
  if (!image || name === undefined) return null;
  const { x, y, width, height, rotated } = own;
  return { name, x, y, spacing: 0, images: [image], cell: { frame: cell.frameIndex, width, height, rotated, source: sourceOf(cell) } };
};

const packedOf = (page: PackedPage, placed: ReadonlyMap<string, PackedItem>, cell: SheetCell, next: number): PackedItem | undefined =>
  cell.twin === undefined ? page.packed.items[next] : placed.get(`${cell.spriteIndex}:${cell.twin}`);

const atlasPage = (planned: PlannedAtlas, page: PackedPage, input: AtlasInput): AtlasPage => {
  const cells: SheetCell[] = page.groups.flatMap((group) => planned.plan.cells.filter((cell) => cell.spriteIndex === group));
  const strips = sheetAnimationItems(input.artwork, input.sheet).map((item) => stripImages(input.artwork, item));
  const placed = new Map<string, PackedItem>();
  const items: AtlasItem[] = [];
  const animations: AtlasAnimation[] = [];
  let next = 0;
  for (const cell of cells) {
    const own = packedOf(page, placed, cell, next);
    if (cell.twin === undefined) next += 1;
    if (!own) continue;
    placed.set(`${cell.spriteIndex}:${cell.frameIndex}`, own);
    const item = itemOfCell(planned, cell, own);
    const strip = item ? null : stripOfCell(planned, strips, cell, own);
    if (item) items.push(item);
    if (strip) animations.push(strip);
  }
  return { items, animations };
};

export { atlasPage };
