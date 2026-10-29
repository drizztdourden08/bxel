/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { planMovesIn } from '../../file-ops/plan-moves-in';
import { relocateWith } from '../../file-ops/relocate-with';
import type { ToolHandler } from '../assistant.type';
import { entryKindAt } from './entry-kind-at';
import { locateInProject } from './locate-in-project';
import { placePath } from './place-path';
import { planFailure } from './plan-failure';
import type { MoveFilesInput } from './project-files-input.type';
import { reply } from './reply';
import { toolKit } from './tool-kit';
import { referrersVisible } from './referrers-visible';
import { TOOL_TEXT } from './tools.constants';
import { writeScope } from './write-scope';

const moveFiles: ToolHandler = async (input, context) => {
  const request = input as MoveFilesInput;
  const scope = await writeScope(context, request.projectId, request.files, 'files');
  if (!scope.ok) return reply(scope);
  const { visible, entries } = scope.value;
  const target = placePath(visible, request.into, 'into');
  if (!target.ok) return reply(target);
  if (request.into.path !== undefined && (await entryKindAt(context.documents, target.value)) !== 'folder') {
    return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: 'into' }));
  }
  const paths = entries.map((each) => each.path);
  const plan = await planMovesIn(context.documents, paths, target.value);
  if (typeof plan === 'string') return reply(planFailure(plan, 'into'));
  const hidden = referrersVisible(visible, paths);
  if (hidden) return reply(hidden);
  const outcome = await relocateWith(toolKit(context), plan);
  if (!outcome.ok) return reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, outcome.message));
  const moved = plan.flatMap((move) => {
    const from = locateInProject(visible, move.from);
    const to = locateInProject(visible, move.to);
    return from && to ? [{ from, to }] : [];
  });
  return reply({ ok: true, projectId: request.projectId, moved, linksRewritten: outcome.rewritten });
};

export { moveFiles };
