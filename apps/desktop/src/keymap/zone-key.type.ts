/* @layer renderer-app @kind types */
import type { CommandDef } from '@drizztdourden08/brock-react';

type ZoneKey = Omit<CommandDef, 'run' | 'whileTyping'>;

export type { ZoneKey };
