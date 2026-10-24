/* @layer helper @kind logic */
import { readAppLaunch } from '@drizztdourden08/brock-electron/bridge';
import type { AppLaunch } from '@drizztdourden08/brock-electron/bridge';

const launchOf = (file: string): AppLaunch | null => {
  try {
    return readAppLaunch({ file });
  } catch {
    return null;
  }
};

export { launchOf };
