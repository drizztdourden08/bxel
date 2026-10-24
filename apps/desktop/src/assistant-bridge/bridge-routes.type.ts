/* @layer renderer-app @kind types */
import type { ToolReply } from '@bxel/mcp';
import type { InvokeChannel } from '@drizztdourden08/brock-core/ipc';

type ToolRouteCall = (token: string, input: unknown) => Promise<ToolReply>;

type ToolRoute = InvokeChannel<string, ToolRouteCall>;

export type { ToolRoute, ToolRouteCall };
