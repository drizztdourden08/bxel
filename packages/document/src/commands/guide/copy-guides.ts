/* @layer core @kind logic */
import type { Guides } from '../../model/sprite.type';

const copyGuides = (guides: Guides): Guides | undefined =>
  guides.x.length === 0 && guides.y.length === 0 ? undefined : { x: [...guides.x], y: [...guides.y] };

export { copyGuides };
