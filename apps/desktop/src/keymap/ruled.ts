/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { gated } from './gated';
import { EDITOR_SCOPE } from './keymap.constants';

const ruled = (def: CommandDef): CommandDef => gated({ scope: EDITOR_SCOPE, ...def });

export { ruled };
