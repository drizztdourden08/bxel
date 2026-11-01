/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { currentFocus } from '../timeline/current-focus';
import { deleteFrames } from '../timeline/delete-frames';
import { togglePlayback } from '../timeline/toggle-playback';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const onCanvasTarget = (): boolean => {
  const active = document.activeElement;
  return currentFocus() !== null && !(active instanceof HTMLElement && active.closest('button, a, input, textarea, select, [role="combobox"], [role="menuitem"], [role="dialog"]') !== null);
};

const TIMELINE_COMMANDS: readonly CommandDef[] = [
  {
    id: 'timeline.delete',
    label: 'Delete the picked frames',
    group: COMMAND_GROUP.timeline,
    chord: 'Delete',
    zone: COMMAND_ZONE.timeline,
    whileTyping: false,
    run: deleteFrames,
  },
  {
    id: 'timeline.toggle_play',
    label: 'Play or pause the animation',
    group: COMMAND_GROUP.timeline,
    run: () => togglePlayback(),
  },
  {
    id: 'timeline.toggle_play_paint',
    label: 'Play or pause the animation while painting',
    group: COMMAND_GROUP.timeline,
    chord: 'Shift+Enter',
    whileTyping: false,
    when: onCanvasTarget,
    run: () => togglePlayback(),
  },
].map(ruled);

export { TIMELINE_COMMANDS };
