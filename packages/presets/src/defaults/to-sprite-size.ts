/* @layer core @kind logic */
import type { SizePair } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';

const toSpriteSize = (pair: SizePair): SpriteSize => ({ width: pair[0], height: pair[1] });

export { toSpriteSize };
