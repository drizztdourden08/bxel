/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const movedOrder = (bank: PaletteBank, moving: readonly number[], gap: number): string[] => {
  const picked = new Set(moving.filter((index) => index > 0));
  const ids = bank.slots.map((slot) => String(slot.id));
  const kept = ids.filter((_, index) => !picked.has(index));
  const block = ids.filter((_, index) => picked.has(index));
  const before = ids.slice(0, Math.max(1, gap)).filter((_, index) => !picked.has(index)).length;
  return [...kept.slice(0, before), ...block, ...kept.slice(before)];
};

export { movedOrder };
