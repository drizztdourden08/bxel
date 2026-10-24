/* @layer renderer-app @kind logic */
import type { Artwork, PaletteBank } from '@bxel/document';
import { changePicture } from './change-picture';
import { framesText } from './frames-text';
import { CHANGE_TEXT } from './palette-change.constants';
import type { ChangePreview, ChangeRequest } from './palette-change.type';
import { spriteUse } from './sprite-use';
import { swatchIssue } from './swatch-issue';
import { swatchLine } from './swatch-line';

const swatchPreview = (artwork: Artwork, bank: PaletteBank, request: ChangeRequest): ChangePreview => {
  const uses = artwork.sprites
    .filter((sprite) => sprite.bankId === bank.id)
    .map((sprite) => ({ sprite, use: spriteUse(sprite, request.swatch) }))
    .filter((entry) => entry.use.pixels > 0);
  const pixels = uses.reduce((sum, entry) => sum + entry.use.pixels, 0);
  const first = uses[0];
  const picture =
    first && request.other !== null
      ? changePicture({ sprite: first.sprite, bank, frame: first.use.frames[0] ?? 1, removed: request.swatch, other: request.other })
      : null;
  return {
    swatchLine: swatchLine(bank, request.swatch),
    bankName: bank.name,
    affected: uses.map(({ sprite, use }) => ({ id: sprite.id, name: sprite.name, frames: framesText(use.frames), pixels: use.pixels })),
    totalSprites: artwork.sprites.length,
    pixels,
    picture,
    countBefore: CHANGE_TEXT.slots(bank.slots.length, bank.cap),
    countAfter: CHANGE_TEXT.slots(bank.slots.length - 1, bank.cap),
    error: swatchIssue(bank, request, pixels),
  };
};

export { swatchPreview };
