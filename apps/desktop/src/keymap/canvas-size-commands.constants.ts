/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { cropToSelection } from '../canvas-size/crop-to-selection';
import { trimActiveSprite } from '../canvas-size/trim-active-sprite';
import { useCanvasSizeStore } from '../stores/useCanvasSizeStore';
import { CANVAS_SIZE_COMMAND_ID as ID } from './canvas-size-command-id.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';
import { pixelCommand } from './pixel-command';

const group = COMMAND_GROUP.edit;

const CANVAS_SIZE_COMMANDS: readonly CommandDef[] = [
  pixelCommand({ id: ID.cropToSelection, label: 'Crop to selection', group, chord: 'Mod+Shift+X', whileTyping: false, run: () => void cropToSelection() }),
  pixelCommand({ id: ID.trim, label: 'Trim to content', group, chord: 'Mod+Shift+T', whileTyping: false, run: () => void trimActiveSprite() }),
  pixelCommand({ id: ID.size, label: 'Canvas size', group, chord: 'Mod+Alt+C', whileTyping: false, run: () => void useCanvasSizeStore.getState().show() }),
].map(editorCommand);

export { CANVAS_SIZE_COMMANDS };
