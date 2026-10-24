/* @layer helper @kind logic */
import { MCP_TIMEOUT_MS } from '@bxel/mcp';
import { readBridgeDiscovery } from '@drizztdourden08/brock-electron/bridge';
import { mkdirSync, watch } from 'fs';
import { dirname } from 'path';
import type { DiscoveryWait, StartedChild } from './helper.type';

const readyFor = (file: string, pid: number | undefined, since: number): boolean => {
  try {
    const discovery = readBridgeDiscovery(file);
    return discovery.pid === pid || Date.parse(discovery.startedAt) >= since;
  } catch {
    return false;
  }
};

const waitForDiscovery = (file: string, started: StartedChild, since: number): Promise<DiscoveryWait> =>
  new Promise((resolve) => {
    const folder = dirname(file);
    mkdirSync(folder, { recursive: true });
    const finish = (result: DiscoveryWait): void => {
      watcher.close();
      clearTimeout(timer);
      resolve(result);
    };
    const check = (): void => {
      if (readyFor(file, started.child.pid, since)) finish({ kind: 'ready' });
    };
    const watcher = watch(folder, check);
    const timer = setTimeout(() => finish({ kind: 'timeout' }), MCP_TIMEOUT_MS.start);
    void started.exited.then((code) => finish({ kind: 'exit', code }));
    check();
  });

export { waitForDiscovery };
