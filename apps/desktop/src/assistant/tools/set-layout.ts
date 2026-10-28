/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { announce } from '@drizztdourden08/brock-react';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { LayoutOp } from './layout-op.type';
import { layoutSnapshot } from './layout-snapshot';
import { reply } from './reply';
import { runLayoutOp } from './run-layout-op';

const setLayout: ToolHandler = (input, context) => {
  const { ops } = input as { readonly ops: readonly LayoutOp[] };
  let applied = 0;
  const notes: string[] = [];
  for (const [at, op] of ops.entries()) {
    const { problem, sized } = runLayoutOp(op);
    if (sized?.reason) notes.push(`Op ${at + 1} (${op.op}) ${sized.size === null ? 'changed the size' : `ended at ${sized.size} px`}. ${sized.reason}`);
    if (problem !== null) return reply(mcpFailure(MCP_ERROR_CODE.LAYOUT_INVALID, `Op ${at + 1} (${op.op}) failed. ${problem}`, { path: `ops.${at}` }));
    applied += 1;
  }
  announce(APP_TOOL_TEXT.viewLine(context.call.session.displayName, `changed the layout (${applied} ${applied === 1 ? 'change' : 'changes'})`));
  return reply({ ok: true, applied, ...(notes.length === 0 ? {} : { notes }), ...layoutSnapshot() });
};

export { setLayout };
