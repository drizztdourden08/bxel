/* @layer helper @kind logic */
import { MCP_ERROR_CODE } from '@bxel/mcp';
import type { HelloClient, McpResult, ToolReply, ToolRouteName } from '@bxel/mcp';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import { BYE_ROUTE, TOOL_ROUTES } from '../assistant-bridge/bridge-routes.constants';
import { bridgeFailure } from './bridge-failure';
import { createGrantTracker } from './create-grant-tracker';
import { isBridgeRunning } from './is-bridge-running';
import { openBridge } from './open-bridge';
import { requestHello } from './request-hello';
import type { BridgeSession } from './helper.type';

const createBridgeSession = (file: string): BridgeSession => {
  const state = {
    link: null as BridgeClient | null,
    token: null as Promise<McpResult<string>> | null,
    client: { name: null, version: null } as HelloClient,
    launchToken: null as string | null,
  };
  const tracker = createGrantTracker();
  const link = (): BridgeClient => {
    state.link ??= openBridge(file, tracker);
    return state.link;
  };
  const drop = (): void => {
    state.link?.close();
    state.link = null;
    state.token = null;
  };
  const pair = async (): Promise<McpResult<string>> => {
    const reply = await requestHello(link(), state.client, state.launchToken);
    if (!reply.ok) {
      state.token = null;
      return reply;
    }
    tracker.accept(reply.sessionId, reply.grant);
    return { ok: true, value: reply.token };
  };
  const tokenOf = (): Promise<McpResult<string>> => {
    state.token ??= pair();
    return state.token;
  };
  const attempt = async (tool: ToolRouteName, input: unknown): Promise<ToolReply> => {
    const token = await tokenOf();
    if (!token.ok) return { outcome: token, images: [] };
    return link().request(TOOL_ROUTES[tool], token.value, input);
  };
  const call = async (tool: ToolRouteName, input: unknown): Promise<ToolReply> => {
    try {
      const first = await attempt(tool, input);
      if (first.outcome.ok || first.outcome.error.code !== MCP_ERROR_CODE.SESSION_UNKNOWN) return first;
      state.token = null;
      return await attempt(tool, input);
    } catch (error) {
      drop();
      return { outcome: bridgeFailure(error), images: [] };
    }
  };
  const bye = async (): Promise<void> => {
    const token = state.token === null ? null : await state.token;
    if (token?.ok) await link().request(BYE_ROUTE, { token: token.value }).catch(() => false);
    drop();
  };
  return {
    call,
    bye,
    isRunning: () => isBridgeRunning(file),
    setClient: (client) => (state.client = client),
    setLaunchToken: (token) => (state.launchToken = token),
    grant: tracker.current, onGrant: tracker.onChange,
  };
};

export { createBridgeSession };
