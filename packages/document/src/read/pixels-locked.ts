/* @layer core @kind logic */
import type { Layer, Sprite } from '../model/sprite.type';
import { effectiveLock } from './effective-lock';

const pixelsLocked = (sprite: Pick<Sprite, 'layers'>, layer: Layer): boolean => effectiveLock(sprite.layers, layer).pixels;

export { pixelsLocked };
