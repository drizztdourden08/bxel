/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Artwork } from '../../model/artwork.type';
import type { CelSlotRef } from '../../schema/command-options.type';
import { pickFrames } from '../frame/pick-frames';
import { pickLayers } from '../layer/pick-layers';
import type { PickedSlot } from './cel.type';

const pickSlots = (artwork: Artwork, sprites: readonly SpriteId[], slot: CelSlotRef, side: string): PickedSlot[] => {
  const layers = pickLayers(artwork, sprites, slot.layer);
  const frames = pickFrames(artwork, sprites, slot.frame, `options.${side}.frame`);
  return layers.flatMap(({ sprite, layer }) => {
    const picked = frames.find((item) => item.sprite.id === sprite.id);
    return picked ? [{ sprite, layer, frame: picked.frame, celId: layer.cels[picked.frame.id] }] : [];
  });
};

export { pickSlots };
