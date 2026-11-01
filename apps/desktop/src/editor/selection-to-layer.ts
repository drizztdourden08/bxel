/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { ADVANCED_COMMAND } from '@bxel/raster';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { executeLayerSteps } from './execute-layer-steps';
import { freeLayerName } from './free-layer-name';
import { layerBlock } from './layer-block';
import { layerErrorText } from './layer-error-text';
import { LAYER_LABEL, LAYER_TEXT } from './layer-text.constants';
import { selectionMask } from './selection/selection-mask';

const selectionToLayer = (cut: boolean): void => {
  const target = currentTarget();
  if (!target) return;
  const notices = useNoticeStore.getState();
  const mask = selectionMask(target);
  if (!mask) {
    notices.post(LAYER_TEXT.noSelection);
    return;
  }
  const blocked = cut ? layerBlock(target.layer, target.sprite.layers) : null;
  if (blocked !== null) {
    notices.post(blocked);
    return;
  }
  const { sprite, frameId, layer } = target;
  const name = freeLayerName(sprite.layers, LAYER_TEXT.partName(layer.name));
  const cel = { sprites: [sprite.id], frames: { by: 'ids' as const, ids: [frameId] } };
  const from = { sprite: sprite.id, frame: frameId, layer: layer.id, rect: { x: 0, y: 0, width: sprite.width, height: sprite.height }, mask };
  const steps = [
    { name: COMMAND_NAME.layerAdd, targets: { ...cel, layers: { by: 'all' as const } }, options: { name, above: { by: 'id', id: layer.id } } },
    { name: ADVANCED_COMMAND.pixelsCopyRegion, targets: { ...cel, layers: { by: 'names' as const, names: [name] } }, options: { from, at: { x: 0, y: 0 } } },
    ...(cut ? [{ name: ADVANCED_COMMAND.pixelsClear, targets: { ...cel, layers: { by: 'ids' as const, ids: [layer.id] } }, options: { mask } }] : []),
  ];
  const refused = executeLayerSteps(target, cut ? LAYER_LABEL.cutToLayer : LAYER_LABEL.toLayer, steps);
  if (refused) {
    notices.post(layerErrorText(refused, sprite));
    return;
  }
  const made = currentTarget()?.sprite.layers.find((each) => each.name === name);
  if (made) useToolStore.getState().setLayer(made.id);
};

export { selectionToLayer };
