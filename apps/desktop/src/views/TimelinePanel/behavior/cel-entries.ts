/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { currentSelection } from '../../../timeline/current-selection';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { frameSubmenu } from './frame-submenu';

const celEntries = (layerId: string | undefined): readonly ContextMenuEntry[] => {
  const target = currentTarget();
  if (!target) return [];
  const layer = target.sprite.layers.find((each) => each.id === layerId) ?? target.layer;
  const selection = currentSelection(target);
  const args = { layerId: layer.id };
  const linked = selection.frames.length > 1;
  return [
    { command: 'timeline.link_cels', label: TIMELINE_MENU.link, ...unless(linked, TIMELINE_MENU.needFrames) },
    { command: 'timeline.unlink_cels', label: TIMELINE_MENU.unlink },
    { command: 'timeline.add_tag', label: TIMELINE_MENU.addTag },
    { command: 'timeline.toggle_onion', label: TIMELINE_MENU.onion },
    frameSubmenu(),
    {
      label: TIMELINE_MENU.layer,
      items: [
        { command: 'layer.toggle_visible', label: TIMELINE_MENU.visible, args, checked: layer.visible },
        { command: 'layer.toggle_locked', label: TIMELINE_MENU.locked, args, checked: layer.locked },
        COMMAND_ID.layerAdd,
      ],
    },
    'separator',
    { command: 'timeline.delete_frames', label: TIMELINE_MENU.deleteFrames, ...unless(target.sprite.frames.length > 1, TIMELINE_MENU.oneFrame) },
    { command: 'timeline.clear_cels', label: TIMELINE_MENU.clearCels },
  ];
};

export { celEntries };
