/* @layer helper @kind logic */
import { spawn } from 'child_process';
import { LAUNCH } from '../assistant-bridge/launch.constants';
import type { AppLaunch, StartedChild } from './helper.type';

const spawnBxel = (launch: AppLaunch, window: 'headless' | 'visible', launchToken: string): StartedChild => {
  const env: NodeJS.ProcessEnv = { ...process.env, [LAUNCH.tokenEnv]: launchToken };
  delete env.ELECTRON_RUN_AS_NODE;
  const extra = window === 'headless' ? [...LAUNCH.headlessArgs] : [];
  const child = spawn(launch.command, [...launch.args, `${LAUNCH.startFlag}=${window}`, ...extra], {
    detached: true,
    windowsHide: true,
    stdio: 'ignore',
    env,
  });
  const exited = new Promise<number | null>((resolve) => {
    child.once('exit', (code) => resolve(code));
    child.once('error', () => resolve(null));
  });
  child.unref();
  return { child, exited };
};

export { spawnBxel };
