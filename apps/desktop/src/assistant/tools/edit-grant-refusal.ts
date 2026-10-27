/* @layer renderer-app @kind logic */
import { checkGrant } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';

const editGrantRefusal = (tool: 'apply_edits' | 'preview_edits', input: unknown, context: ToolContext): ToolReply | null => {
  const { session } = context.call;
  const denied = checkGrant(tool, input, session.grant, session.displayName);
  return denied ? reply(denied) : null;
};

export { editGrantRefusal };
