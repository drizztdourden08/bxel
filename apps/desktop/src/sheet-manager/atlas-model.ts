/* @layer renderer-app @kind logic */
import { sheetExtent } from '@bxel/document';
import { packSheet } from '@bxel/formats';
import { EMPTY_ATLAS } from './atlas-model.constants';
import { atlasPackSettings } from './atlas-pack-settings';
import type { AtlasHeld, AtlasInput, AtlasItem, AtlasModel } from './manager.type';

const itemOf = ({ sprite, at }: AtlasHeld): AtlasItem => ({
  id: sprite.id,
  name: sprite.name,
  x: at.x,
  y: at.y,
  width: sprite.width,
  height: sprite.height,
  pivot: sprite.pivot,
});

const finish = (width: number, height: number, items: readonly AtlasItem[]): AtlasModel => {
  const used = items.reduce((sum, item) => sum + item.width * item.height, 0);
  const total = width * height;
  return { width, height, items, used, empty: total === 0 ? 0 : Math.max(0, 1 - used / total), failure: null };
};

const manualModel = ({ sheet }: AtlasInput, held: readonly AtlasHeld[]): AtlasModel => {
  const sizes = new Map(held.map(({ sprite }) => [sprite.id, { width: sprite.width, height: sprite.height }] as const));
  const extent = sheetExtent(sheet, sizes);
  return finish(extent.width, extent.height, held.map(itemOf));
};

const atlasModel = (input: AtlasInput): AtlasModel => {
  const { sheet, sprites, extrude } = input;
  const byId = new Map(sprites.map((sprite) => [sprite.id, sprite] as const));
  const held: AtlasHeld[] = sheet.entries.flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    return sprite ? [{ sprite, at: entry.at }] : [];
  });
  if (held.length === 0) return EMPTY_ATLAS;
  const items = held.map(({ sprite }) => ({ key: sprite.id, width: sprite.width, height: sprite.height }));
  const settings = atlasPackSettings(sheet, items, extrude);
  if (!settings) return manualModel(input, held);
  const packed = packSheet(items, settings);
  if (!packed.ok) return { ...EMPTY_ATLAS, failure: packed.message };
  const at = new Map(packed.items.map((item) => [item.key, { x: item.x, y: item.y }] as const));
  return finish(
    packed.width,
    packed.height,
    held.map((each) => itemOf({ sprite: each.sprite, at: at.get(each.sprite.id) ?? each.at })),
  );
};

export { atlasModel };
