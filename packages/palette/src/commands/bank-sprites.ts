/* @layer core @kind logic */
import type { BankId, Artwork, Sprite } from '@bxel/document';

const bankSprites = (artwork: Artwork, bankId: BankId): Sprite[] => artwork.sprites.filter((sprite) => sprite.bankId === bankId);

export { bankSprites };
