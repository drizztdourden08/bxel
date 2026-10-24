/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { ResolvedPair, SwatchPair } from './assign-pair.type';
import { slotIndex } from './slot-index';

const resolveAssignPairs = (sources: readonly PaletteBank[], dest: PaletteBank, mapping: readonly SwatchPair[]): ResolvedPair[] =>
  mapping.map((pair, at) => {
    const path = `options.mapping.${at}`;
    const source = sources.find((bank) => bank.slots.some((slot) => slot.id === pair.from));
    if (!source) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Swatch ${pair.from} is not in a palette of the targeted sprites.`, { path: `${path}.from` });
    }
    const from = slotIndex(source, pair.from, `${path}.from`);
    if (from === 0) throw fail(ERROR_CODE.INVALID_OPTION, 'Slot 0 always maps to slot 0.', { path: `${path}.from` });
    if (mapping.findIndex((other) => other.from === pair.from) !== at) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Swatch ${pair.from} is mapped twice.`, { path: `${path}.from` });
    }
    return { source: source.id, from, to: slotIndex(dest, pair.to, `${path}.to`) };
  });

export { resolveAssignPairs };
