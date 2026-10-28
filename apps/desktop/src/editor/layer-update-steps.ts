/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, LayerId } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import type { EditorTarget } from './editor.type';
import { frameSprites } from './frame-sprites';
import type { LayerFields } from './layer-lock.type';
import { reachesAllFrames } from './reaches-all-frames';
import { spriteScope } from './sprite-scope';

const optionsOf = (fields: LayerFields): Record<string, unknown> =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

const nameStep = (target: EditorTarget, layerId: LayerId, fields: LayerFields): CommandStep[] => {
  const layer = target.sprite.layers.find((each) => each.id === layerId);
  if (!layer) return [];
  const key = layer.name.toLowerCase();
  const sprites = frameSprites(target).filter((sprite) => sprite.layers.some((each) => each.name.toLowerCase() === key));
  return [{ name: COMMAND_NAME.layerUpdate, targets: spritesTarget(sprites.map((sprite) => sprite.id)), options: { layer: { by: 'name', name: layer.name }, ...optionsOf(fields) } }];
};

const idStep = (target: EditorTarget, layerId: LayerId, fields: LayerFields): CommandStep => ({
  name: COMMAND_NAME.layerUpdate,
  targets: spriteScope(target),
  options: { layer: { by: 'id', id: layerId }, ...optionsOf(fields) },
});

const layerUpdateSteps = (target: EditorTarget, ids: readonly LayerId[], fields: LayerFields): CommandStep[] =>
  ids.flatMap((id) => (reachesAllFrames(target) ? nameStep(target, id, fields) : [idStep(target, id, fields)]));

export { layerUpdateSteps };
