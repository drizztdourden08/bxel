/* @layer renderer-app @kind logic */
import type { ToolOutcome, ToolReply } from '@bxel/mcp';

const reply = (outcome: ToolOutcome, images: readonly string[] = []): ToolReply => ({ outcome, images });

export { reply };
