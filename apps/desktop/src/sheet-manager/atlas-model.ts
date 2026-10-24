/* @layer renderer-app @kind logic */
import { sheetExtent } from '@bxel/document';
import { nextPowerOfTwo } from '@bxel/formats';
import { atlasHeld } from './atlas-held';
import { EMPTY_ATLAS } from './atlas-model.constants';
import { atlasPackSettings } from './atlas-pack-settings';
import { atlasPages } from './atlas-pages';
import type { AtlasHeld, AtlasInput, AtlasItem, AtlasModel } from './manager.type';

const itemOf = ({ sprite, at, source }: AtlasHeld): AtlasItem => ({
  id: sprite.id,
  name: sprite.name,
  x: at.x,
  y: at.y,
  width: source.width,
  height: source.height,
  pivot: sprite.pivot,
  source,
});

const finish = (size: { width: number; height: number }, items: readonly AtlasItem[], pages: { page: number; pageCount: number }): AtlasModel => {
  const used = items.reduce((sum, item) => sum + item.width * item.height, 0);
  const total = size.width * size.height;
  return { ...size, items, used, empty: total === 0 ? 0 : Math.max(0, 1 - used / total), failure: null, ...pages };
};

const manualModel = ({ sheet, powerOfTwo }: AtlasInput, held: readonly AtlasHeld[]): AtlasModel => {
  const sizes = new Map(held.map(({ sprite }) => [sprite.id, { width: sprite.width, height: sprite.height }] as const));
  const extent = sheetExtent(sheet, sizes);
  const size = powerOfTwo ? { width: nextPowerOfTwo(extent.width), height: nextPowerOfTwo(extent.height) } : extent;
  return finish(size, held.map(itemOf), { page: 0, pageCount: 1 });
};

const atlasModel = (input: AtlasInput): AtlasModel => {
  const held = atlasHeld(input);
  if (held.length === 0) return EMPTY_ATLAS;
  const items = held.map(({ sprite, source }) => ({ key: sprite.id, width: source.width, height: source.height }));
  const settings = atlasPackSettings(input.sheet, items, input.extrude, input.powerOfTwo);
  if (!settings) return manualModel(input, held);
  const paged = atlasPages(items, settings, input.pageSide);
  if (!paged.ok) return { ...EMPTY_ATLAS, failure: paged.message };
  const page = Math.min(Math.max(0, input.page), paged.pages.length - 1);
  const shown = paged.pages[page];
  const at = new Map((shown?.packed.items ?? []).map((item) => [item.key, { x: item.x, y: item.y }] as const));
  const here = held.filter((each) => at.has(each.sprite.id)).map((each) => itemOf({ ...each, at: at.get(each.sprite.id) ?? each.at }));
  return finish({ width: shown?.packed.width ?? 0, height: shown?.packed.height ?? 0 }, here, { page, pageCount: paged.pages.length });
};

export { atlasModel };
