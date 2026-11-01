/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { ANIMATION_ENTRY_TEXT } from '../sheet-manager/animation-entry-text.constants';
import { copyAnimationsForSheet } from '../sheet-manager/copy-animations-for-sheet';
import { currentManager } from '../sheet-manager/current-manager';
import type { CurrentManager } from '../sheet-manager/manager.type';
import { pickedAnimations } from '../sheet-manager/picked-animations';
import { placeAnimationFrames } from '../sheet-manager/place-animation-frames';
import { rowsPerTag } from '../sheet-manager/rows-per-tag';
import { pickTab } from '../workspace/pick-tab';
import { COMMAND_GROUP } from './keymap.constants';

const group = COMMAND_GROUP.sheet;

const withManager = (run: (manager: CurrentManager) => unknown) => (): void => {
  const manager = currentManager();
  if (manager) run(manager);
};

const ANIMATION_ENTRY_COMMANDS: readonly CommandDef[] = [
  {
    id: 'sprite.open_in_timeline',
    label: ANIMATION_ENTRY_TEXT.openInTimeline,
    group,
    run: withManager((manager) => {
      const [first] = pickedAnimations(manager);
      if (first) pickTab({ kind: 'animation', id: first.animation.id });
    }),
  },
  { id: 'sprite.copy_animation_for_sheet', label: ANIMATION_ENTRY_TEXT.copyForSheet, group, run: withManager(copyAnimationsForSheet) },
  { id: 'sprite.place_animation_frames', label: ANIMATION_ENTRY_TEXT.placeFrames, group, run: withManager(placeAnimationFrames) },
  { id: 'sprite.rows_per_tag', label: ANIMATION_ENTRY_TEXT.rowsPerTag, group, run: withManager(rowsPerTag) },
];

export { ANIMATION_ENTRY_COMMANDS };
