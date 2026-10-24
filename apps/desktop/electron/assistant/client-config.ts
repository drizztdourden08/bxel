/* @layer electron-main @kind logic */
import { helperLaunch } from '@drizztdourden08/brock-electron/main';
import type { ClientConfig } from '../../src/assistant/assistant.type';
import { LAUNCH } from '../../src/assistant-bridge/launch.constants';

const clientConfig = (): ClientConfig => {
  const launch = helperLaunch(LAUNCH.helper);
  return { command: launch.command, args: launch.args, env: { ...launch.env } };
};

export { clientConfig };
