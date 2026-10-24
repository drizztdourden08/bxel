/* @layer core @kind logic */
import { layerMergeSchema } from '../../schema/layer-merge-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkMerge } from './check-merge';
import { mergeLayer } from './merge-layer';
import { pickLayers } from './pick-layers';

const layerMerge = defineCommand({
  name: COMMAND_NAME.layerMerge,
  scope: 'sprites',
  schema: layerMergeSchema,
  run: (draft, input) => {
    const picked = pickLayers(draft.project, input.sprites, input.options.layer);
    checkMerge(picked, input.options.allowLocked);
    for (const { sprite, layer, index } of picked) {
      const below = sprite.layers[index - 1];
      if (below) mergeLayer(draft, sprite.id, layer, below);
    }
  },
});

export { layerMerge };
