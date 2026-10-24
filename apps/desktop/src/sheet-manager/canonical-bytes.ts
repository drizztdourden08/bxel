/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { compareBytes } from './compare-bytes';
import type { Orientation } from './identical.type';
import { spriteBytes } from './sprite-bytes';

const canonicalBytes = (sprite: Sprite, orientations: readonly Orientation[]): Uint8Array =>
  orientations
    .map((orientation) => spriteBytes(sprite, orientation))
    .reduce((best, each) => (compareBytes(each, best) < 0 ? each : best));

export { canonicalBytes };
