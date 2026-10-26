/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import type { GuideAxis } from './guide.type';

const guideLimit = (sprite: Sprite, axis: GuideAxis): number => (axis === 'x' ? sprite.width : sprite.height);

export { guideLimit };
