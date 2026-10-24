/* @layer renderer-app @kind constants */
import { MCP_ROUTE, TOOL_ROUTE } from '@bxel/mcp';
import type { ByeRequest, HelloReply, HelloRequest, ToolRouteName } from '@bxel/mcp';
import { invoke } from '@drizztdourden08/brock-core/ipc';
import type { ToolRoute, ToolRouteCall } from './bridge-routes.type';

const HELLO_ROUTE = invoke<(request: HelloRequest) => Promise<HelloReply>>()(MCP_ROUTE.hello);

const BYE_ROUTE = invoke<(request: ByeRequest) => Promise<boolean>>()(MCP_ROUTE.bye);

const TOOL_ROUTES = Object.fromEntries(
  Object.entries(TOOL_ROUTE).map(([name, channel]) => [name, invoke<ToolRouteCall>()(channel)]),
) as Readonly<Record<ToolRouteName, ToolRoute>>;

export { BYE_ROUTE, HELLO_ROUTE, TOOL_ROUTES };
