/* @layer helper @kind logic */
import { MCP_TIMEOUT_MS } from '@bxel/mcp';
import { connectBridge } from '@drizztdourden08/brock-electron/bridge';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import { GRANT_EVENT } from '../assistant-bridge/bridge-routes.constants';
import type { GrantTracker } from './create-grant-tracker.type';

const openBridge = (file: string, tracker: GrantTracker): BridgeClient => {
  const client = connectBridge({ file, timeoutMs: MCP_TIMEOUT_MS.bridge });
  client.on(GRANT_EVENT, tracker.follow);
  return client;
};

export { openBridge };
