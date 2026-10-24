/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { bankSpriteImage } from './bank-sprite-image';
import type { FrameImage } from './sheet.type';

const spriteImage = (artwork: Artwork, sprite: Sprite): FrameImage | null => bankSpriteImage(findBank(artwork, sprite.bankId), sprite);

export { spriteImage };
