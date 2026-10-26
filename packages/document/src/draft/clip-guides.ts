/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { Sprite } from '../model/sprite.type';

const clipGuides = (sprite: Sprite, size: Size): Sprite => {
  const { guides, ...rest } = sprite;
  if (!guides) return sprite;
  const x = guides.x.filter((at) => at <= size.width);
  const y = guides.y.filter((at) => at <= size.height);
  if (x.length === guides.x.length && y.length === guides.y.length) return sprite;
  return x.length === 0 && y.length === 0 ? rest : { ...rest, guides: { x, y } };
};

export { clipGuides };
