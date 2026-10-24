/* @layer renderer-app @kind logic */
import { sheetExtent } from '@bxel/document';
import { nextPowerOfTwo } from '@bxel/formats';
import type { PackedPage, SheetCell } from '@bxel/formats';
import { atlasHeld } from './atlas-held';
import { EMPTY_ATLAS } from './atlas-model.constants';
import { atlasPlan } from './atlas-plan';
import type { AtlasHeld, AtlasInput, AtlasItem, AtlasModel, AtlasPlanned } from './manager.type';

const itemOf = ({ sprite, at, source }: AtlasHeld): AtlasItem => ({
  id: sprite.id,
  name: sprite.name,
  frame: 0,
  x: at.x,
  y: at.y,
  width: source.width,
  height: source.height,
  rotated: false,
  pivot: sprite.pivot,
  source,
});

const finish = (size: { width: number; height: number }, items: readonly AtlasItem[], pages: { page: number; pageCount: number }): AtlasModel => {
  const used = items.reduce((sum, item) => sum + item.width * item.height, 0);
  const total = size.width * size.height;
  return { ...size, items, used, empty: total === 0 ? 0 : Math.max(0, 1 - used / total), failure: null, ...pages };
};

const manualModel = ({ sheet, artwork, powerOfTwo }: AtlasInput): AtlasModel => {
  const held = atlasHeld(sheet, artwork.sprites);
  const sizes = new Map(held.map(({ sprite }) => [sprite.id, { width: sprite.width, height: sprite.height }] as const));
  const extent = sheetExtent(sheet, sizes);
  const size = powerOfTwo ? { width: nextPowerOfTwo(extent.width), height: nextPowerOfTwo(extent.height) } : extent;
  return finish(size, held.map(itemOf), { page: 0, pageCount: 1 });
};

const pageItems = (planned: Extract<AtlasPlanned, { ok: true }>, page: PackedPage): AtlasItem[] => {
  const cells: SheetCell[] = page.groups.flatMap((group) => planned.plan.cells.filter((cell) => cell.spriteIndex === group));
  return page.packed.items.flatMap((packed, at) => {
    const cell = cells[at];
    const sprite = cell ? planned.targets[cell.spriteIndex]?.sprite : undefined;
    if (!cell || !sprite) return [];
    const { image, offsetX, offsetY } = cell.trimmed;
    const source = { x: offsetX, y: offsetY, width: image.width, height: image.height };
    const { x, y, width, height, rotated } = packed;
    return [{ id: sprite.id, name: sprite.name, frame: cell.frameIndex, x, y, width, height, rotated, pivot: sprite.pivot, source }];
  });
};

const atlasModel = (input: AtlasInput): AtlasModel => {
  if (input.sheet.entries.length === 0) return EMPTY_ATLAS;
  if (input.sheet.layout.kind === 'manual') return manualModel(input);
  const planned = atlasPlan(input);
  if (!planned.ok) return { ...EMPTY_ATLAS, failure: planned.message };
  const page = Math.min(Math.max(0, input.page), planned.plan.pages.length - 1);
  const shown = planned.plan.pages[page];
  if (!shown) return EMPTY_ATLAS;
  const size = { width: shown.packed.width, height: shown.packed.height };
  return finish(size, pageItems(planned, shown), { page, pageCount: planned.plan.pages.length });
};

export { atlasModel };
