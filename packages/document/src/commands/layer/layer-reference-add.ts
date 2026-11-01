/* @layer core @kind logic */
import { FULL_VIEW_OPACITY, NO_LOCK } from '../../model/layer-lock.constants';
import type { LayerId } from '../../model/ids.type';
import { layerReferenceAddSchema } from '../../schema/layer-reference-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { addLayers } from './add-layers';
import { chooseLayerName } from './choose-layer-name';
import { freeName } from './free-name';
import { REFERENCE_NAME } from './layer.constants';

const stemOf = (path: string): string => {
  const stem = path.split(/[\\/]/).at(-1)?.replace(/\.[^.]+$/, '');
  return stem === undefined || stem === '' ? REFERENCE_NAME : stem;
};

const layerReferenceAdd = defineCommand({
  name: COMMAND_NAME.layerReferenceAdd,
  scope: 'sprites',
  schema: layerReferenceAddSchema,
  run: (draft, input) => {
    const { path, x, y, name, above, viewOpacity } = input.options;
    addLayers(draft, input, above, (_sprite, names, anchor) => ({
      layer: {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(name, names, freeName(names, stemOf(path))),
        visible: true,
        lock: NO_LOCK,
        kind: 'reference',
        ...(anchor?.layer.parentId ? { parentId: anchor.layer.parentId } : {}),
        ...(viewOpacity === FULL_VIEW_OPACITY ? {} : { viewOpacity }),
        reference: { path, x, y },
        cels: {},
      },
      at: anchor ? anchor.index + 1 : 0,
    }));
  },
});

export { layerReferenceAdd };
