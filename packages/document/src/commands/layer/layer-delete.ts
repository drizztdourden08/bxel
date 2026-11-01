/* @layer core @kind logic */
import { pixelsLocked } from '../../read/pixels-locked';
import { blockOf } from '../../layer-tree/block-of';
import { layerKindOf } from '../../read/layer-kind-of';
import { layerDeleteSchema } from '../../schema/layer-delete-schema';
import { ERROR_CODE } from '../error-code.constants';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { removeLayer } from './remove-layer';

const layerDelete = defineCommand({
  name: COMMAND_NAME.layerDelete,
  scope: 'sprites',
  schema: layerDeleteSchema,
  run: (draft, input) => {
    const picked = pickLayers(draft.artwork, input.sprites, input.options.layer);
    const sole = picked.filter(({ sprite, layer }) => {
      const block = blockOf(sprite.layers, layer.id);
      return !sprite.layers.some((item) => !block.has(item.id) && layerKindOf(item) === 'pixel');
    });
    failIfAny(
      ERROR_CODE.LAST_LAYER,
      'A sprite keeps at least one pixel layer.',
      sole.map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'it is the only layer')),
    );
    const locked = input.options.allowLocked ? [] : picked.filter(({ sprite, layer }) => pixelsLocked(sprite, layer));
    failIfAny(
      ERROR_CODE.LAYER_LOCKED,
      'A locked layer is deleted only with allowLocked.',
      locked.map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'locked')),
    );
    for (const { sprite, layer } of picked) {
      const block = blockOf(sprite.layers, layer.id);
      for (const item of sprite.layers.filter((each) => block.has(each.id))) removeLayer(draft, sprite.id, item);
    }
  },
});

export { layerDelete };
