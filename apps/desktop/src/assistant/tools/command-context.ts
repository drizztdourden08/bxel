/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import type { Args } from './run-command.type';

const commandContext = (args: Args): CommandContext => ({ point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: null, args });

export { commandContext };
