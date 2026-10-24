/* @layer core @kind logic */
import type { CelId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import type { SpriteJson } from '../document-json.type';

const spriteShell = (sprite: Sprite): SpriteJson => {
  const { cels, ...shell } = sprite;
  return { ...shell, celIds: Object.keys(cels).sort() as CelId[] };
};

export { spriteShell };
