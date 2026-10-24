/* @layer core @kind logic */
import { dropUnusedCels } from '../artwork/drop-unused-cels';
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { CelId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';
import type { CelSlot } from './cel-slot.type';
import type { Draft } from './draft.type';
import { updateSprite } from './update-sprite';

const withSlot = (layer: Layer, slot: CelSlot, celId: CelId | null): Layer => {
  if (celId) return { ...layer, cels: { ...layer.cels, [slot.frameId]: celId } };
  return { ...layer, cels: Object.fromEntries(Object.entries(layer.cels).filter(([frameId]) => frameId !== slot.frameId)) };
};

const assertSlot = (sprite: Sprite, slot: CelSlot, celId: CelId | null): Layer => {
  const layer = sprite.layers.find((item) => item.id === slot.layerId);
  if (!layer || !sprite.frames.some((frame) => frame.id === slot.frameId)) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Layer ${slot.layerId} or frame ${slot.frameId} does not exist in sprite ${sprite.id}.`);
  }
  if (celId && !sprite.cels[celId]) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Cel ${celId} does not exist in sprite ${sprite.id}.`);
  return layer;
};

const setCelSlot = (draft: Draft, slot: CelSlot, celId: CelId | null): void => {
  updateSprite(draft, slot.spriteId, (sprite) => {
    const layer = assertSlot(sprite, slot, celId);
    const replaced = layer.cels[slot.frameId];
    if ((replaced ?? null) === celId) return sprite;
    const layers = sprite.layers.map((item) => (item.id === layer.id ? withSlot(layer, slot, celId) : item));
    return dropUnusedCels({ ...sprite, layers }, replaced ? [replaced] : []);
  });
};

export { setCelSlot };
