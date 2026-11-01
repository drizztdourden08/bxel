/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { CommandWarning } from '../commands/result.type';
import type { LayerId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';
import { nameKey } from '../validate/name-key';
import { findLayer } from '../read/find-layer';
import { layerKindOf } from '../read/layer-kind-of';
import { pixelsLocked } from '../read/pixels-locked';
import { shownInTree } from '../layer-tree/shown-in-tree';
import type { LayerPick, ResolveLayersInput } from './resolved-scope.type';

const issueFor = (sprite: Sprite, layer: Layer, reason: string) => [
  { spriteId: sprite.id, layerId: layer.id, frameId: null, reason },
];

const strictLayer = (sprite: Sprite, id: LayerId): Layer => {
  const layer = findLayer(sprite, id);
  if (!layer) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Layer ${id} does not exist in sprite ${sprite.id}.`);
  if (layerKindOf(layer) !== 'pixel') {
    throw fail(ERROR_CODE.LAYER_KIND, `Layer "${layer.name}" is a ${layerKindOf(layer)} layer and holds no pixels to edit.`, { details: issueFor(sprite, layer, 'not a pixel layer') });
  }
  if (pixelsLocked(sprite, layer)) {
    throw fail(ERROR_CODE.LAYER_LOCKED, `Layer "${layer.name}" is locked.`, { details: issueFor(sprite, layer, 'locked') });
  }
  if (!shownInTree(sprite.layers, layer)) {
    throw fail(ERROR_CODE.LAYER_HIDDEN, `Layer "${layer.name}" is hidden.`, { details: issueFor(sprite, layer, 'hidden') });
  }
  return layer;
};

const skipUneditable = (sprite: Sprite, layers: readonly Layer[], step: number): LayerPick => {
  const warnings: CommandWarning[] = [];
  const editable: Layer[] = [];
  for (const layer of layers) {
    if (layerKindOf(layer) !== 'pixel') continue;
    if (pixelsLocked(sprite, layer)) warnings.push({ code: ERROR_CODE.LAYER_LOCKED, step, message: `Skipped locked layer "${layer.name}".` });
    else if (!shownInTree(sprite.layers, layer)) warnings.push({ code: ERROR_CODE.LAYER_HIDDEN, step, message: `Skipped hidden layer "${layer.name}".` });
    else editable.push(layer);
  }
  return { layers: editable, warnings };
};

const resolveLayers = ({ sprite, selector, step }: ResolveLayersInput): LayerPick => {
  switch (selector.by) {
    case 'ids':
      return { layers: selector.ids.map((id) => strictLayer(sprite, id)), warnings: [] };
    case 'names': {
      const keys = new Set(selector.names.map(nameKey));
      return skipUneditable(
        sprite,
        sprite.layers.filter((layer) => keys.has(nameKey(layer.name))),
        step,
      );
    }
    case 'all':
      return skipUneditable(sprite, sprite.layers, step);
  }
};

export { resolveLayers };
