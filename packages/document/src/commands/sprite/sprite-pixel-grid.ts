/* @layer core @kind logic */
import type { Size } from '../../model/geometry.type';
import type { Sprite } from '../../model/sprite.type';

const sameGrid = (first: Size | undefined, second: Size | undefined): boolean => first?.width === second?.width && first?.height === second?.height;

const spritePixelGrid = (sprite: Sprite, requested: Size | null | undefined): Pick<Sprite, 'pixelGrid'> => {
  if (requested === undefined) return {};
  const next = requested ?? undefined;
  return sameGrid(sprite.pixelGrid, next) ? {} : { pixelGrid: next };
};

export { spritePixelGrid };
