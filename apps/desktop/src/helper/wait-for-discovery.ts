/* @layer helper @kind logic */
import { MCP_TIMEOUT_MS } from '@bxel/mcp';
import { readBridgeDiscovery } from '@drizztdourden08/brock-electron/bridge';
import { mkdirSync, watch } from 'fs';
import { dirname } from 'path';
import type { DiscoveryTarget, DiscoveryWait } from './helper.type';

const readyFor = (file: string, pid: number | undefined, since: number): boolean => {
  try {
    const discovery = readBridgeDiscovery(file);
    return discovery.pid === pid || Date.parse(discovery.startedAt) >= since;
  } catch {
    return false;
  }
};

const waitForDiscovery = (file: string, target: DiscoveryTarget, since: number, waitMs: number = MCP_TIMEOUT_MS.start): Promise<DiscoveryWait> =>
  new Promise((resolve) => {
    const folder = dirname(file);
    mkdirSync(folder, { recursive: true });
    const finish = (result: DiscoveryWait): void => {
      watcher.close();
      clearTimeout(timer);
      resolve(result);
    };
    const check = (): void => {
      if (readyFor(file, target.pid, since)) finish({ kind: 'ready' });
    };
    const watcher = watch(folder, check);
    const timer = setTimeout(() => finish({ kind: 'timeout' }), waitMs);
    void target.exited.then((code) => finish({ kind: 'exit', code }));
    check();
  });

export { waitForDiscovery };
