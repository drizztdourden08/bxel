/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { ANIMATION_ENTRY_TEXT } from '../../../sheet-manager/animation-entry-text.constants';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { pickedAnimations } from '../../../sheet-manager/picked-animations';

const animationEntries = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): ContextMenuEntry => {
  const some = unless(pickedAnimations(manager).length > 0, ANIMATION_ENTRY_TEXT.needAnimation);
  const onSheet = unless(pickedAnimations(manager).length > 0 && manager.sheet !== null, manager.sheet === null ? ANIMATION_ENTRY_TEXT.needSheet : ANIMATION_ENTRY_TEXT.needAnimation);
  return {
    label: ANIMATION_ENTRY_TEXT.group,
    items: [
      { command: 'sprite.open_in_timeline', label: ANIMATION_ENTRY_TEXT.openInTimeline, ...some },
      { command: 'sprite.copy_animation_for_sheet', label: ANIMATION_ENTRY_TEXT.copyForSheet, ...onSheet },
      { command: 'sprite.place_animation_frames', label: ANIMATION_ENTRY_TEXT.placeFrames, ...some },
      { command: 'sprite.rows_per_tag', label: ANIMATION_ENTRY_TEXT.rowsPerTag, ...onSheet },
    ],
  };
};

export { animationEntries };
