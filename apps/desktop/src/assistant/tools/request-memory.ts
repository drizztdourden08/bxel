/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import { REQUEST_MEMORY_MAX } from './tools.constants';

const replies = new Map<string, ToolReply>();

const requestMemory = {
  recall: (key: string): ToolReply | undefined => replies.get(key),
  keep: (key: string, value: ToolReply): void => {
    replies.set(key, value);
    const oldest = replies.keys().next();
    if (replies.size > REQUEST_MEMORY_MAX && !oldest.done) replies.delete(oldest.value);
  },
};

export { requestMemory };
