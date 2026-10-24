/* @layer core @kind logic */
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
    const sole = picked.filter(({ sprite }) => sprite.layers.length === 1);
    failIfAny(
      ERROR_CODE.LAST_LAYER,
      'A sprite keeps at least one layer.',
      sole.map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'it is the only layer')),
    );
    const locked = input.options.allowLocked ? [] : picked.filter(({ layer }) => layer.locked);
    failIfAny(
      ERROR_CODE.LAYER_LOCKED,
      'A locked layer is deleted only with allowLocked.',
      locked.map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'locked')),
    );
    for (const { sprite, layer } of picked) removeLayer(draft, sprite.id, layer);
  },
});

export { layerDelete };
