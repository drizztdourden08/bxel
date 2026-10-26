/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { layerIsSolo } from '../../../editor/layer-is-solo';
import { LAYER_TEXT } from '../../../editor/layer-text.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { LAYER_MENU } from '../LayersPanel.constants';

const newLayerOnly: readonly ContextMenuEntry[] = [COMMAND_ID.layerAdd];

const layerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const target = currentTarget();
  const layerId = menuTarget(context, LAYER_MENU.row)?.dataset.reorderKey;
  const layers = target?.sprite.layers ?? [];
  const at = layers.findIndex((layer) => layer.id === layerId);
  const layer = layers[at];
  if (!target || !layer) return newLayerOnly;
  const args = { layerId: layer.id };
  const only = layers.length === 1;
  return [
    { command: 'layer.toggle_visible', label: LAYER_MENU.visible, args, checked: layer.visible },
    { command: 'layer.toggle_locked', label: LAYER_MENU.locked, args, checked: layer.locked },
    { command: 'layer.solo', args, checked: layerIsSolo(target.sprite, layer.id), ...unless(!only, LAYER_MENU.oneLayer) },
    { command: 'layer.rename', label: LAYER_MENU.rename },
    'separator',
    COMMAND_ID.layerAdd,
    COMMAND_ID.layerDuplicate,
    { command: COMMAND_ID.layerMerge, label: LAYER_MENU.mergeDown, ...unless(at > 0, LAYER_TEXT.bottom) },
    { command: COMMAND_ID.layerFlatten, ...unless(layers.some((each) => each.visible), LAYER_TEXT.noVisible) },
    { command: 'layer.move_up', args, ...unless(at < layers.length - 1, LAYER_MENU.top) },
    { command: 'layer.move_down', args, ...unless(at > 0, LAYER_MENU.bottom) },
    'separator',
    { command: COMMAND_ID.layerDelete, ...unless(!only, LAYER_TEXT.lastLayer) },
  ];
};

export { layerMenuEntries };
