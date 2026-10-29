/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { planRenameIn } from '../../file-ops/plan-rename-in';
import { relocateWith } from '../../file-ops/relocate-with';
import type { OpenProject } from '../../project/project.type';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import { planFailure } from './plan-failure';
import type { Entry, RenameFileInput } from './project-files-input.type';
import { reply } from './reply';
import { toolKit } from './tool-kit';
import { referrersVisible } from './referrers-visible';
import { writeScope } from './write-scope';

const renamed = async (context: ToolContext, visible: OpenProject, request: RenameFileInput, entry: Entry): Promise<ToolReply> => {
  const from = locateInProject(visible, entry.path);
  const plan = await planRenameIn(context.documents, entry.path, request.name, entry.folder);
  if (typeof plan === 'string') return reply(planFailure(plan, 'name'));
  const hidden = plan === null ? null : referrersVisible(visible, [entry.path]);
  if (hidden) return reply(hidden);
  const outcome = plan === null ? { ok: true as const, rewritten: 0 } : await relocateWith(toolKit(context), [plan]);
  const to = locateInProject(visible, plan === null ? entry.path : plan.to);
  if (!outcome.ok) return reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, outcome.message));
  return from && to ? reply({ ok: true, projectId: request.projectId, from, to, linksRewritten: outcome.rewritten }) : reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, 'The file is not in a folder the assistant can see.'));
};

const renameFile: ToolHandler = async (input, context) => {
  const request = input as RenameFileInput;
  const scope = await writeScope(context, request.projectId, [request.file], 'file');
  if (!scope.ok) return reply(scope);
  const [entry] = scope.value.entries;
  return entry ? renamed(context, scope.value.visible, request, entry) : reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, 'No such file.'));
};

export { renameFile };
