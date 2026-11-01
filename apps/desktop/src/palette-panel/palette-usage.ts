/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import { duplicateGroups } from './duplicate-groups';
import type { PaletteUsage, UsageReach } from './palette-panel.type';
import { slotUsage } from './slot-usage';

const scopedSprites = (artwork: Artwork, bank: PaletteBank, { sprite, scope, animation }: UsageReach): Sprite[] => {
  if (scope === 'sprite' && sprite) return [sprite];
  if (scope === 'animation' && animation) {
    const ids = new Set(animation.frames.map((frame) => frame.spriteId));
    return artwork.sprites.filter((each) => ids.has(each.id));
  }
  return bankSprites(artwork, bank.id);
};

const paletteUsage = (artwork: Artwork, bank: PaletteBank, reach: UsageReach): PaletteUsage => {
  const sprites = scopedSprites(artwork, bank, reach);
  const slots = slotUsage(sprites, bank.slots.length);
  const unused = bank.slots.flatMap((slot, index) => (index > 0 && slot.kind === 'color' && (slots[index]?.pixels ?? 0) === 0 ? [index] : []));
  return { slots, unused, duplicates: duplicateGroups(bank) };
};

export { paletteUsage };
