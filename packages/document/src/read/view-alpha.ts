/* @layer core @kind logic */
import { ancestorsOf } from '../layer-tree/ancestors-of';
import { FULL_VIEW_OPACITY } from '../model/layer-lock.constants';
import type { Layer } from '../model/sprite.type';

const viewAlpha = (layers: readonly Layer[], layer: Layer): number =>
  [layer, ...ancestorsOf(layers, layer)].reduce((alpha, each) => alpha * ((each.viewOpacity ?? FULL_VIEW_OPACITY) / FULL_VIEW_OPACITY), 1);

export { viewAlpha };
