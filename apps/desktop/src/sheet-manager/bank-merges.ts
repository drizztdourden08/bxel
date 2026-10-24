/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, PaletteBank, Sprite } from '@bxel/document';
import { countUsage } from '@bxel/palette';
import type { BankMerges } from './bank.type';
import { nearestSlot } from './nearest-slot';
import { slotRgb } from './slot-rgb';

const usedSlots = (sprites: readonly Sprite[]): number[] => {
  const buffers = sprites.flatMap((sprite) =>
    Object.values(sprite.cels).map((cel) => ({ pixels: cel.pixels, width: sprite.width, height: sprite.height })),
  );
  const usage = countUsage(buffers);
  return Array.from(usage.keys()).filter((slot) => slot > 0 && (usage[slot] ?? 0) > 0);
};

const mergesOf = (source: PaletteBank, sprites: readonly Sprite[], dest: PaletteBank): BankMerges => {
  const used = usedSlots(sprites);
  const landing = new Set(used.map((slot) => nearestSlot(slotRgb(source, slot), dest)));
  return { colours: used.length, merged: used.length - landing.size };
};

const bankMerges = (artwork: Artwork, movers: readonly Sprite[], dest: PaletteBank): BankMerges => {
  const parts = [...new Set(movers.map((sprite) => sprite.bankId))].flatMap((id) => {
    const source = findBank(artwork, id);
    return source ? [mergesOf(source, movers.filter((sprite) => sprite.bankId === id), dest)] : [];
  });
  return {
    colours: parts.reduce((sum, part) => sum + part.colours, 0),
    merged: parts.reduce((sum, part) => sum + part.merged, 0),
  };
};

export { bankMerges };
