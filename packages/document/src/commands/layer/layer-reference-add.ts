/* @layer core @kind logic */
import { FULL_VIEW_OPACITY, NO_LOCK } from '../../model/layer-lock.constants';
import type { LayerId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import { layerReferenceAddSchema } from '../../schema/layer-reference-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { freeName } from './free-name';
import { insertLayer } from './insert-layer';
import { REFERENCE_NAME } from './layer.constants';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';

const stemOf = (path: string): string => path.split(/[\\/]/).at(-1)?.replace(/\.[^.]+$/, '') || REFERENCE_NAME;

const layerReferenceAdd = defineCommand({
  name: COMMAND_NAME.layerReferenceAdd,
  scope: 'sprites',
  schema: layerReferenceAddSchema,
  run: (draft, input) => {
    const { path, x, y, name, above, viewOpacity } = input.options;
    const anchors = above ? pickLayers(draft.artwork, input.sprites, above) : [];
    const created: LayerId[] = [];
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      const names = sprite.layers.map((layer) => layer.name);
      const anchor = anchors.find((picked) => picked.sprite.id === spriteId);
      const layer: Layer = {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(name, names, freeName(names, stemOf(path))),
        visible: true,
        lock: NO_LOCK,
        kind: 'reference',
        ...(anchor?.layer.parentId ? { parentId: anchor.layer.parentId } : {}),
        ...(viewOpacity === FULL_VIEW_OPACITY ? {} : { viewOpacity }),
        reference: { path, x, y },
        cels: {},
      };
      insertLayer(draft, spriteId, layer, anchor ? anchor.index + 1 : 0);
      created.push(layer.id);
    }
    registerLayerRef(draft, input, created);
  },
});

export { layerReferenceAdd };
