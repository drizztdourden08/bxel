/* @layer renderer-app @kind logic */
import type { McpRig } from './mcp-rig.type';
import { openMcpRig } from './open-mcp-rig';

const openFullRig = (): Promise<McpRig> => openMcpRig('Full control');

export { openFullRig };
