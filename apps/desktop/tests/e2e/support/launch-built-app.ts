/* @layer renderer-app @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { HEADLESS_ARGS, waitForAppPage } from '@drizztdourden08/brock-build/testing';
import { _electron } from 'playwright-core';
import { APP_DIR } from './e2e.constants';
import type { LaunchedApp } from './e2e.type';

const electronBinary = (): string => {
  const resolved: unknown = createRequire(join(APP_DIR, 'package.json'))('electron');
  if (typeof resolved !== 'string') throw new Error('electron did not resolve to a binary path');
  return resolved;
};

const launchBuiltApp = async (userData: string): Promise<LaunchedApp> => {
  const { ELECTRON_RUN_AS_NODE: _unused, ...env } = process.env;
  const app = await _electron.launch({
    executablePath: electronBinary(),
    args: [APP_DIR, ...HEADLESS_ARGS, `--user-data=${userData}`],
    cwd: APP_DIR,
    env: Object.fromEntries(Object.entries(env).filter((entry): entry is [string, string] => entry[1] !== undefined)),
  });
  const page = await waitForAppPage(app);
  await page.waitForLoadState('domcontentloaded');
  return { app, page, close: () => app.close() };
};

export { launchBuiltApp };
