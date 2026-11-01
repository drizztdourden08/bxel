/* @layer core @kind logic */
import { layerKindOf } from '../../read/layer-kind-of';
import { layerReferenceRelinkSchema } from '../../schema/layer-reference-relink-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { replaceLayer } from './replace-layer';

const layerReferenceRelink = defineCommand({
  name: COMMAND_NAME.layerReferenceRelink,
  scope: 'sprites',
  schema: layerReferenceRelinkSchema,
  run: (draft, input) => {
    const { layer: ref, path, x, y } = input.options;
    const picked = pickLayers(draft.artwork, input.sprites, ref);
    failIfAny(
      ERROR_CODE.LAYER_KIND,
      'Relink takes a reference layer.',
      picked.filter(({ layer }) => layerKindOf(layer) !== 'reference').map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'not a reference layer')),
    );
    for (const { sprite, layer } of picked) {
      const before = layer.reference ?? { path: '', x: 0, y: 0 };
      const after = { path: path ?? before.path, x: x ?? before.x, y: y ?? before.y };
      if (after.path !== before.path || after.x !== before.x || after.y !== before.y) replaceLayer(draft, sprite.id, { ...layer, reference: after });
    }
  },
});

export { layerReferenceRelink };
