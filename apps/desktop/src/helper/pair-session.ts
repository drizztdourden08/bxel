/* @layer helper @kind logic */
import type { HelloClient, McpResult } from '@bxel/mcp';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import type { GrantTracker } from './create-grant-tracker.type';
import { requestHello } from './request-hello';

const pairSession = async (link: BridgeClient, client: HelloClient, launchToken: string | null, tracker: GrantTracker): Promise<McpResult<string>> => {
  const reply = await requestHello(link, client, launchToken);
  if (!reply.ok) return reply;
  tracker.accept(reply.sessionId, reply.grant);
  return { ok: true, value: reply.token };
};

export { pairSession };
