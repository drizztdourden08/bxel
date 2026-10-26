/* @layer core @kind logic */
import type { Guides, Sprite } from '../../model/sprite.type';

const withGuides = (sprite: Sprite, guides: Guides): Sprite => {
  const { guides: _old, ...rest } = sprite;
  return guides.x.length === 0 && guides.y.length === 0 ? rest : { ...rest, guides };
};

export { withGuides };
