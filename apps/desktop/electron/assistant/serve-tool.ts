/* @layer electron-main @kind logic */
import { checkGrant, parseToolInput } from '@bxel/mcp';
import type { CallSession, ToolReply, ToolRouteName, ToolSpec } from '@bxel/mcp';
import type { BridgeCall } from '@drizztdourden08/brock-electron/bridge';
import { app } from 'electron';
import { assistantFolder } from './assistant-folder';
import { TOOL_TIMEOUT } from './assistant.constants';
import type { AssistantMain, LiveSession } from './assistant.type';
import { askTool } from './ask-tool';
import { instanceView } from './instance-view';
import { resolveTarget } from './resolve-target';
import { checkSession } from './check-session';
import { showWindow } from './show-window';
import { stopBxel } from './stop-bxel';
import { toolReply } from './tool-reply';

const callSession = ({ sessionId, mode, grant, trust, client, displayName }: LiveSession): CallSession => ({
  sessionId,
  mode,
  grant,
  trust,
  client,
  displayName,
});

const forward = async (state: AssistantMain, tool: ToolRouteName, session: LiveSession, input: unknown): Promise<ToolReply> => {
  if (tool === 'show_window') return showWindow(state);
  if (tool === 'stop_bxel') return stopBxel(state, session, input);
  const ctx = state.ctx;
  const target = ctx ? await resolveTarget(ctx, assistantFolder(state), { tool, input }) : { ok: true as const, value: null };
  if (!target.ok) return toolReply(target);
  const call = {
    tool,
    input,
    session: callSession(session),
    instance: instanceView(state, session),
    target: target.value,
    folder: assistantFolder(state),
    version: app.getVersion(),
  };
  return askTool(state, call, TOOL_TIMEOUT[tool]);
};

const serveTool =
  (state: AssistantMain, tool: ToolRouteName, spec: ToolSpec) =>
  async (bridgeCall: BridgeCall, token: string, raw: unknown): Promise<ToolReply> => {
    const checked = checkSession(state, bridgeCall, token);
    if (!checked.ok) return toolReply(checked);
    const session = checked.value;
    const parsed = parseToolInput(spec, raw);
    if (!parsed.ok) return toolReply(parsed);
    const denied = checkGrant(tool, parsed.value, session.grant, session.displayName);
    if (denied) return toolReply(denied);
    session.lastCallAt = Date.now();
    return forward(state, tool, session, parsed.value);
  };

export { serveTool };
