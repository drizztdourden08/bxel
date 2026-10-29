/* @layer renderer-app @kind logic */
import { programKey } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { MCP_CLIENT_NAME } from './mcp.constants';
import type { McpRig } from './mcp-rig.type';

const pushGrant = ({ session }: McpRig, grant: Grant): Promise<unknown> =>
  session.page.evaluate(`window.api.assistantSyncGrants(${JSON.stringify([{ key: programKey(MCP_CLIENT_NAME), grant }])})`);

export { pushGrant };
