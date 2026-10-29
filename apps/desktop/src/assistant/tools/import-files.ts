/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { resolveDefaults } from '@bxel/project';
import { appAssetDefaults } from '../../asset-defaults/app-asset-defaults';
import { projectWorkspaceId } from '../../workspace/project-workspace-id';
import type { ToolHandler } from '../assistant.type';
import { importSources } from './import-sources';
import { placePath } from './place-path';
import type { ImportFilesInput } from './project-files-input.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { writeScope } from './write-scope';

const importFiles: ToolHandler = async (input, context) => {
  const request = input as ImportFilesInput;
  const scope = await writeScope(context, request.projectId, request.sources, 'sources');
  if (!scope.ok) return reply(scope);
  const { visible, entries } = scope.value;
  const documentId = projectWorkspaceId();
  const target = request.into === undefined ? { ok: true as const, value: null } : placePath(visible, request.into, 'into');
  if (!target.ok) return reply(target);
  if (documentId === null) return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_OWNER, TOOL_TEXT.projectNotOpen));
  const defaults = resolveDefaults(appAssetDefaults(undefined), visible.manifest.defaults);
  const report = await importSources(context, { visible, documentId, defaults, into: target.value }, entries);
  return reply({ ok: true, projectId: request.projectId, ...report });
};

export { importFiles };
