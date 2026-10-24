/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import { entryPaths } from '../entry-paths';

const byPath = ([left]: readonly [string, Uint8Array], [right]: readonly [string, Uint8Array]): number =>
  left < right ? -1 : 1;

const spriteBlobs = (sprite: Sprite): ReadonlyMap<string, Uint8Array> =>
  new Map(
    Object.values(sprite.cels)
      .map((cel): [string, Uint8Array] => [entryPaths.cel(cel.id), cel.pixels])
      .sort(byPath),
  );

export { spriteBlobs };
