/* @layer renderer-app @kind logic */
import { commands, nav } from '@drizztdourden08/brock-react';

const runInEditor = (command: string): void => {
  nav.close();
  commands.run(command);
};

export { runInEditor };
