/* @layer core @kind config */
import type { LayerLock } from './sprite.type';

const NO_LOCK: LayerLock = { pixels: false, transparency: false, position: false };
const FULL_VIEW_OPACITY = 100;
const LAYER_KINDS = ['pixel', 'group', 'reference'] as const;
const MAP_LAYER_KINDS = ['tiles', 'group'] as const;

export { FULL_VIEW_OPACITY, LAYER_KINDS, MAP_LAYER_KINDS, NO_LOCK };
