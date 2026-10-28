/* @layer renderer-app @kind logic */
import type { Artwork, BankId } from '@bxel/document';
import { bankSprites } from './bank-sprites';
import type { PaletteSharing } from './palette-panel.type';

const paletteSharing = (artwork: Artwork, bankId: BankId): PaletteSharing => {
  const sprites = bankSprites(artwork, bankId).filter((sprite) => sprite.role !== 'frame');
  return { sprites, shared: sprites.length > 1 };
};

export { paletteSharing };
