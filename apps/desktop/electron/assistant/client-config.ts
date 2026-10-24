/* @layer electron-main @kind logic */
import { helperLaunch } from '@drizztdourden08/brock-electron/main';
import { app } from 'electron';
import type { ClientConfig } from '../../src/assistant/assistant.type';
import { LAUNCH } from '../../src/assistant-bridge/launch.constants';

const clientConfig = (): ClientConfig => {
  const launch = helperLaunch(LAUNCH.helper);
  const env: Record<string, string> = { ...launch.env };
  if (app.isPackaged) env[LAUNCH.appEnv] = JSON.stringify({ command: launch.command, args: [] });
  return { command: launch.command, args: launch.args, env };
};

export { clientConfig };
