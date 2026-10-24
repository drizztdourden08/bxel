/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { PaletteBank, Sprite } from '@bxel/document';
import { bankUsage } from './bank-usage';

const checkAssignTarget = (dest: PaletteBank, sprites: readonly Sprite[]): void => {
  const already = sprites.filter((sprite) => sprite.bankId === dest.id);
  if (already.length > 0) {
    throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `Some sprites already use palette "${dest.name}".`, {
      details: already.map((sprite) => ({ spriteId: sprite.id, layerId: null, frameId: null, reason: 'already uses this palette' })),
    });
  }
  if (dest.slots.length < 2 && bankUsage(sprites).some((count, slot) => slot > 0 && count > 0)) {
    throw fail(ERROR_CODE.INVALID_OPTION, `Palette "${dest.name}" has no colour to take the pixels.`, { path: 'options.bankId' });
  }
};

export { checkAssignTarget };
