/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';

const listSprites = (artwork: Artwork): readonly Sprite[] => artwork.sprites.filter((sprite) => sprite.role === 'sprite');

export { listSprites };
