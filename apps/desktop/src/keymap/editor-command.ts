/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { hasActiveDocument } from '../files/has-active-document';
import { EDITOR_SCOPE } from './keymap.constants';

const editorCommand = (def: CommandDef): CommandDef => ({ scope: EDITOR_SCOPE, when: hasActiveDocument, ...def });

export { editorCommand };
