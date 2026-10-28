/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const animationItems = (state: EditorMenuState): MenuEntry[] => {
  const item = (id: string, label: string) => ruledItem(state.context, `timeline.${id}`, label);
  return tidyMenu([
    item('add_frame', 'Add frame'),
    item('duplicate_frames', 'Duplicate frames'),
    item('delete_frames', 'Delete frames'),
    item('move_frames_earlier', 'Move frames earlier'),
    item('move_frames_later', 'Move frames later'),
    item('select_all_frames', 'Select all frames'),
    'separator',
    ruledItem(state.context, 'tag.set_range', 'Set tag range to selection'),
    item('add_tag', 'Add tag on selection'),
    'separator',
    item('add_from_sprites', 'Add frames from sprites...'),
    item('add_from_strip', 'Add frames from a strip...'),
    item('add_from_sheet', 'Add frames from a sheet...'),
    'separator',
    item('split_to_sprites', 'Split frames into sprites'),
    item('make_spritesheet', 'Make a spritesheet'),
    item('export_frames', 'Export frames as images...'),
  ]);
};

export { animationItems };
