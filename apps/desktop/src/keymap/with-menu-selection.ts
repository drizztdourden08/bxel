/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { applyMenuSelection } from '../timeline/apply-menu-selection';

const withMenuSelection = (def: CommandDef): CommandDef => {
  const { run } = def;
  return {
    ...def,
    run: (context?: CommandContext) => {
      applyMenuSelection(context?.selection);
      return run(context);
    },
  };
};

export { withMenuSelection };
