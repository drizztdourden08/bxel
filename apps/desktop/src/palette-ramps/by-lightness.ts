/* @layer renderer-app @kind logic */
import type { PaletteBank, SwatchId } from '@bxel/document';
import { hexToOklch } from '@bxel/palette';

const byLightness = (bank: PaletteBank, ids: readonly SwatchId[]): SwatchId[] => {
  const lightness = new Map(bank.slots.map((slot) => [slot.id, slot.kind === 'color' ? (hexToOklch(slot.rgb)?.l ?? 0) : -1] as const));
  return [...ids].sort((first, second) => (lightness.get(first) ?? 0) - (lightness.get(second) ?? 0));
};

export { byLightness };
