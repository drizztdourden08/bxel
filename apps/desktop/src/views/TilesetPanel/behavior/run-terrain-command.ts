/* @layer renderer-app @kind logic */
import { commands } from '@drizztdourden08/brock-react';

const runTerrainCommand = (id: string, args: object): void => {
  void commands.run(id, { point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: null, args });
};

export { runTerrainCommand };
