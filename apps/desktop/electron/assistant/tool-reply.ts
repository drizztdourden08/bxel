/* @layer electron-main @kind logic */
import type { ToolOutcome, ToolReply } from '@bxel/mcp';

const toolReply = (outcome: ToolOutcome): ToolReply => ({ outcome, images: [] });

export { toolReply };
