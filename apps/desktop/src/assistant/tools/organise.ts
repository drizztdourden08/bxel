/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { editOrganiseWith } from '../../organise/edit-organise-with';
import { organiseOf } from '../../organise/organise-of';
import { useProjectStore } from '../../stores/useProjectStore';
import type { ToolHandler } from '../assistant.type';
import { assetIdsOf } from './asset-ids-of';
import { ORGANISE_BUILDERS } from './organise-op-builders.constants';
import type { Builder } from './organise-op-builders.type';
import type { OrganiseInput } from './project-files-input.type';
import { reply } from './reply';
import { toolKit } from './tool-kit';
import { visibleProject } from './visible-project';

const unknownOp: Builder = () => mcpFailure(MCP_ERROR_CODE.COMMAND_ARGS, 'Unknown operation.', { path: 'op' });

const organised = (projectId: string, note: string, affected: number) => {
  const held = organiseOf(useProjectStore.getState().project?.manifest);
  return {
    ok: true,
    projectId,
    note,
    affected,
    collections: held.collections.map((each) => ({ id: each.id, name: each.name, assets: each.assets.length })),
    searches: held.smart.map((each) => ({ id: each.id, name: each.name, query: each.query })),
  } as const;
};

const organise: ToolHandler = async (input, context) => {
  const request = input as OrganiseInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const assets = assetIdsOf(scope.value.visible, request.files ?? [], request.assets ?? []);
  if (!assets.ok) return reply(assets);
  const op = (ORGANISE_BUILDERS[request.op] ?? unknownOp)(request, assets.value);
  if ('error' in op) return reply(op);
  if (useProjectStore.getState().project?.manifest.projectId !== request.projectId) return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_OWNER, 'The owner has to open this project in Bxel first.'));
  const outcome = await editOrganiseWith(toolKit(context), op);
  return outcome.ok ? reply(organised(request.projectId, outcome.note, assets.value.length)) : reply(mcpFailure(MCP_ERROR_CODE.COMMAND_REFUSED, outcome.message));
};

export { organise };
