/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import { spriteBlobs } from './sprite-blobs';

const byName = ([left]: readonly [string, Uint8Array], [right]: readonly [string, Uint8Array]): number =>
  left < right ? -1 : 1;

const spritesBlobs = (sprites: readonly Sprite[]): ReadonlyMap<string, Uint8Array> =>
  new Map(sprites.flatMap((sprite) => [...spriteBlobs(sprite)]).sort(byName));

export { spritesBlobs };
