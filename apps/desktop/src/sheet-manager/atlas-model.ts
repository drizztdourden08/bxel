/* @layer renderer-app @kind logic */
import { sheetExtent } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { nextPowerOfTwo } from '@bxel/formats';
import { atlasAnimations } from './atlas-animations';
import { atlasHeld } from './atlas-held';
import { EMPTY_ATLAS } from './atlas-model.constants';
import { atlasPage } from './atlas-page';
import { atlasPlan } from './atlas-plan';
import type { AtlasHeld, AtlasInput, AtlasItem, AtlasModel } from './manager.type';

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

const finish = (size: { width: number; height: number }, items: readonly AtlasItem[], pages: { page: number; pageCount: number }, cells: readonly Rect[] = []): AtlasModel => {
  const shared = new Map([...items, ...cells].map((item) => [`${item.x},${item.y},${item.width},${item.height}`, item.width * item.height]));
  const used = [...shared.values()].reduce((sum, area) => sum + area, 0);
  const total = size.width * size.height;
  return { ...size, items, animations: [], used, empty: total === 0 ? 0 : Math.max(0, 1 - used / total), failure: null, ...pages };
};

const manualModel = ({ sheet, artwork, powerOfTwo }: AtlasInput): AtlasModel => {
  const held = atlasHeld(sheet, artwork.sprites);
  const sizes = new Map(held.map(({ sprite }) => [sprite.id, { width: sprite.width, height: sprite.height }] as const));
  const extent = sheetExtent(sheet, sizes);
  const size = powerOfTwo ? { width: nextPowerOfTwo(extent.width), height: nextPowerOfTwo(extent.height) } : extent;
  return finish(size, held.map(itemOf), { page: 0, pageCount: 1 });
};

const manual = (input: AtlasInput): AtlasModel => atlasAnimations(input.sheet.entries.length === 0 ? EMPTY_ATLAS : manualModel(input), input);

const arranged = (input: AtlasInput): AtlasModel => {
  if (input.sheet.entries.length === 0 && (input.sheet.animationEntries ?? []).length === 0) return EMPTY_ATLAS;
  const planned = atlasPlan(input);
  if (!planned.ok) return { ...EMPTY_ATLAS, failure: planned.message };
  const page = Math.min(Math.max(0, input.page), planned.plan.pages.length - 1);
  const shown = planned.plan.pages[page];
  if (!shown) return EMPTY_ATLAS;
  const size = { width: shown.packed.width, height: shown.packed.height };
  const { items, animations } = atlasPage(planned, shown, input);
  const cells = animations.map((each) => ({ x: each.x, y: each.y, width: each.cell?.width ?? 0, height: each.cell?.height ?? 0 }));
  return { ...finish(size, items, { page, pageCount: planned.plan.pages.length }, cells), animations };
};

const atlasModel = (input: AtlasInput): AtlasModel => (input.sheet.layout.kind === 'manual' ? manual(input) : arranged(input));

export { atlasModel };
