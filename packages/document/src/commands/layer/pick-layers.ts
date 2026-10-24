/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Project } from '../../model/project.type';
import type { Layer } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import type { LayerRef } from '../../schema/command-options.type';
import { nameKey } from '../../validate/name-key';
import type { TargetIssue } from '../command-error.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedLayer } from './layer.type';

const matches = (layer: Layer, ref: LayerRef): boolean =>
  ref.by === 'id' ? layer.id === ref.id : nameKey(layer.name) === nameKey(ref.name);

const describe = (ref: LayerRef): string => (ref.by === 'id' ? `Layer ${ref.id}` : `Layer "${ref.name}"`);

const pickLayers = (project: Project, sprites: readonly SpriteId[], ref: LayerRef): PickedLayer[] => {
  if (ref.by === 'id' && sprites.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A layer id is valid with one sprite only. Use a layer name.', {
      path: 'options.layer',
    });
  }
  const picked: PickedLayer[] = [];
  const missing: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const sprite = requireSprite(project, spriteId);
    const index = sprite.layers.findIndex((layer) => matches(layer, ref));
    const layer = sprite.layers[index];
    if (layer) picked.push({ sprite, layer, index });
    else missing.push({ spriteId, layerId: null, frameId: null, reason: 'the layer does not exist' });
  }
  if (missing.length > 0) {
    const code = sprites.length > 1 ? ERROR_CODE.INCOMPATIBLE_TARGETS : ERROR_CODE.TARGET_NOT_FOUND;
    throw fail(code, `${describe(ref)} does not exist in every target sprite.`, { details: missing, path: 'options.layer' });
  }
  return picked;
};

export { pickLayers };
