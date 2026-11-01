/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';

const isReply = (value: object): value is ToolReply => 'outcome' in value;

export { isReply };
