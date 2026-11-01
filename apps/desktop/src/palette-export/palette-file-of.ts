/* @layer renderer-app @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import type { PaletteFile } from '@bxel/formats';

const paletteFileOf = (bank: PaletteBank, indices: readonly number[] | null = null): PaletteFile => {
  const wanted = indices === null ? null : new Set(indices);
  const colors = bank.slots.flatMap((slot, index) => {
    if (slot.kind !== 'color' || (wanted !== null && !wanted.has(index))) return [];
    const hex = formatSwatchColor(slot.rgb, slot.alpha);
    return [{ hex, name: slot.name === hex ? '' : slot.name }];
  });
  return { name: bank.name, colors };
};

export { paletteFileOf };
