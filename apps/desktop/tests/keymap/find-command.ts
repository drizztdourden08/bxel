/* @layer renderer-app @kind test */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';

const findCommand = (id: string): CommandDef => {
  const def = APP_COMMANDS.find((each) => each.id === id);
  if (!def) throw new Error(`no command ${id}`);
  return def;
};

export { findCommand };
