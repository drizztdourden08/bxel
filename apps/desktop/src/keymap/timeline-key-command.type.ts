/* @layer renderer-app @kind types */
import type { CommandDef } from '@drizztdourden08/brock-react';

type KeyDef = Pick<CommandDef, 'id' | 'label' | 'chord' | 'run' | 'when'>;

export type { KeyDef };
