/* @layer electron-main @kind logic */
import { buildTools, SESSION_TOKEN_PATTERN, TOOLS_WITHOUT_SESSION } from '@bxel/mcp';
import type { ToolRouteName } from '@bxel/mcp';
import type { BridgeServer } from '@drizztdourden08/brock-electron/bridge';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { BYE_ROUTE, HELLO_ROUTE, TOOL_ROUTES } from '../../src/assistant-bridge/bridge-routes.constants';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';
import { assistantMain } from './assistant-main';
import { endSessions } from './end-sessions';
import { publishSessions } from './publish-sessions';
import { serveBye } from './serve-bye';
import { serveHello } from './serve-hello';
import { serveTool } from './serve-tool';

const tokenFirst = (args: readonly unknown[]): boolean =>
  args.length === 2 && typeof args[0] === 'string' && SESSION_TOKEN_PATTERN.test(args[0]);

const registerAssistantBridge = (bridge: BridgeServer, ctx: MainContext): void => {
  const state = assistantMain;
  state.ctx = ctx;
  state.bridge = bridge;
  bridge.handleWith(HELLO_ROUTE, serveHello(state), { validate: (args) => args.length === 1 });
  bridge.handleWith(BYE_ROUTE, serveBye(state), { validate: (args) => args.length === 1 });
  for (const tool of buildTools(APP_COMMANDS)) {
    if (TOOLS_WITHOUT_SESSION.includes(tool.name)) continue;
    const name = tool.name as ToolRouteName;
    bridge.handleWith(TOOL_ROUTES[name], serveTool(state, name, tool), { validate: tokenFirst });
  }
  bridge.onClose((connectionId) => endSessions(state, state.sessions.endConnection(connectionId)));
  publishSessions(state);
};

export { registerAssistantBridge };
