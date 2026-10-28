/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { cropToSelection } from '../canvas-size/crop-to-selection';
import { trimActiveSprite } from '../canvas-size/trim-active-sprite';
import { useCanvasSizeStore } from '../stores/useCanvasSizeStore';
import { CANVAS_SIZE_COMMAND_ID as ID } from './canvas-size-command-id.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.edit;

const CANVAS_SIZE_COMMANDS: readonly CommandDef[] = [
  { id: ID.cropToSelection, label: 'Crop to selection', group, chord: 'Mod+Shift+X', whileTyping: false, run: cropToSelection },
  { id: ID.trim, label: 'Trim to content', group, chord: 'Mod+Shift+T', whileTyping: false, run: trimActiveSprite },
  { id: ID.size, label: 'Canvas size', group, chord: 'Mod+Alt+C', whileTyping: false, run: () => useCanvasSizeStore.getState().show() },
].map(ruled);

export { CANVAS_SIZE_COMMANDS };
