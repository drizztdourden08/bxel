/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import type { UsageScope } from '../palette-view/palette-view.type';
import { bankSprites } from './bank-sprites';
import { duplicateGroups } from './duplicate-groups';
import type { PaletteUsage } from './palette-panel.type';
import { slotUsage } from './slot-usage';

const paletteUsage = (artwork: Artwork, bank: PaletteBank, sprite: Sprite, scope: UsageScope): PaletteUsage => {
  const sprites = scope === 'sprite' ? [sprite] : bankSprites(artwork, bank.id);
  const slots = slotUsage(sprites, bank.slots.length);
  const unused = bank.slots.flatMap((slot, index) => (index > 0 && slot.kind === 'color' && (slots[index]?.pixels ?? 0) === 0 ? [index] : []));
  return { slots, unused, duplicates: duplicateGroups(bank) };
};

export { paletteUsage };
