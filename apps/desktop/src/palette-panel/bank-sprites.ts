/* @layer renderer-app @kind logic */
import type { Artwork, BankId, Sprite } from '@bxel/document';

const bankSprites = (artwork: Artwork, bankId: BankId): Sprite[] => artwork.sprites.filter((sprite) => sprite.bankId === bankId);

export { bankSprites };
