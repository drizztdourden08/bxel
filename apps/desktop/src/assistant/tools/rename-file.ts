/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { planRename } from '../../file-ops/plan-rename';
import { relocate } from '../../file-ops/relocate';
import type { ToolHandler } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import { planFailure } from './plan-failure';
import type { RenameFileInput } from './project-files-input.type';
import { reply } from './reply';
import { referrersVisible } from './referrers-visible';
import { resolveEntries } from './resolve-entries';
import { visibleProject } from './visible-project';

const renameFile: ToolHandler = async (input, context) => {
  const request = input as RenameFileInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const entries = await resolveEntries(context, visible, [request.file], 'file');
  if (!entries.ok) return reply(entries);
  const [entry] = entries.value;
  const from = entry ? locateInProject(visible, entry.path) : null;
  if (!entry || !from) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, 'No such file.'));
  const plan = await planRename(entry.path, request.name, entry.folder);
  if (typeof plan === 'string') return reply(planFailure(plan, 'name'));
  if (plan === null) return reply({ ok: true, projectId: request.projectId, from, to: from, linksRewritten: 0 });
  const hidden = referrersVisible(visible, [entry.path]);
  if (hidden) return reply(hidden);
  const outcome = await relocate([plan]);
  if (!outcome.ok) return reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, outcome.message));
  const to = locateInProject(visible, plan.to);
  return to ? reply({ ok: true, projectId: request.projectId, from, to, linksRewritten: outcome.rewritten }) : reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, 'The file is not in a folder the assistant can see.'));
};

export { renameFile };
