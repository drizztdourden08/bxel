/* @layer core @kind logic */
import type { FrameId } from '../../model/ids.type';
import { clipBaseIndex } from '../../read/clip-base-index';
import { layerPixels } from '../../read/layer-pixels';
import { siblingBelow } from '../../read/sibling-below';
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
    const picked = pickLayers(draft.artwork, input.sprites, input.options.layer);
    checkMerge(picked, input.options.allowLocked);
    for (const { sprite, layer, index } of picked) {
      const below = siblingBelow(sprite.layers, index);
      const base = sprite.layers[clipBaseIndex(sprite.layers, index)];
      const maskOf = base ? (frameId: FrameId) => layerPixels(sprite, base, frameId) ?? new Uint8Array(0) : undefined;
      if (below) mergeLayer(draft, sprite.id, layer, below, maskOf);
    }
  },
});

export { layerMerge };
