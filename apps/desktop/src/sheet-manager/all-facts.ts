/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { listSprites } from '../sheet/list-sprites';
import type { SpriteFacts } from './manager.type';
import { spriteFacts } from './sprite-facts';

const allFacts = (artwork: Artwork, sheet: Sheet | null): SpriteFacts[] =>
  listSprites(artwork).map((sprite) => spriteFacts(artwork, sprite, sheet));

export { allFacts };
