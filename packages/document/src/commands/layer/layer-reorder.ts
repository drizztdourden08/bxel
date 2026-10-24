/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import { layerReorderSchema } from '../../schema/layer-reorder-schema';
import { ERROR_CODE } from '../error-code.constants';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';

const layerReorder = defineCommand({
  name: COMMAND_NAME.layerReorder,
  scope: 'sprites',
  schema: layerReorderSchema,
  run: (draft, input) => {
    const { layer: ref, to } = input.options;
    const picked = pickLayers(draft.project, input.sprites, ref);
    failIfAny(
      ERROR_CODE.INDEX_OUT_OF_RANGE,
      'The position is at or above the number of layers.',
      picked.filter(({ sprite }) => to >= sprite.layers.length).map(({ sprite, layer }) => layerIssue(sprite.id, layer, `position ${to} is past the top`)),
    );
    for (const { sprite, layer, index } of picked) {
      if (index === to) continue;
      const rest = sprite.layers.filter((item) => item.id !== layer.id);
      updateSprite(draft, sprite.id, (current) => ({
        ...current,
        layers: [...rest.slice(0, to), layer, ...rest.slice(to)],
      }));
    }
  },
});

export { layerReorder };
