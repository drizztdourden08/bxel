/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isSamePath } from '@bxel/project';
import { editOrganise } from '../../organise/edit-organise';
import type { OrganiseOp } from '../../organise/organise.type';
import { organiseOf } from '../../organise/organise-of';
import { useProjectStore } from '../../stores/useProjectStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { OpenProject } from '../../project/project.type';
import type { ToolHandler } from '../assistant.type';
import { placePath } from './place-path';
import type { OrganiseInput } from './project-files-input.type';
import { reply } from './reply';
import { visibleProject } from './visible-project';

const need = (field: string, op: string): Failure => mcpFailure(MCP_ERROR_CODE.COMMAND_ARGS, `${op} needs ${field}.`, { path: field });

const assetsOf = (project: OpenProject, request: OrganiseInput): readonly string[] | Failure => {
  const ids = new Set(request.assets ?? []);
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project' && isSamePath(each.projectFile ?? '', project.projectFile));
  for (const [at, place] of (request.files ?? []).entries()) {
    const path = placePath(project, place, `files.${at}`);
    if (!path.ok) return path;
    const id = [...(workspace?.paths ?? [])].find(([, held]) => isSamePath(held, path.value))?.[0];
    if (id === undefined) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, 'That file is not an asset of the open project.', { path: `files.${at}.path` });
    ids.add(id);
  }
  return [...ids];
};

const opOf = (request: OrganiseInput, assets: readonly string[]): OrganiseOp | Failure => {
  const { op } = request;
  const withAssets = assets.length > 0 ? null : need('files or assets', op);
  if (op === 'tag' || op === 'untag') {
    if (withAssets) return withAssets;
    return op === 'tag' && (request.tags ?? []).length === 0 ? need('tags', op) : { op, assets, tags: request.tags ?? [] };
  }
  if (op === 'pin' || op === 'unpin') return withAssets ?? { op, assets };
  if (op === 'collect' || op === 'uncollect') {
    if (withAssets) return withAssets;
    return request.collection === undefined ? need('collection', op) : { op, assets, collection: request.collection };
  }
  if (op === 'newCollection') return request.name === undefined ? need('name', op) : { op, name: request.name, assets };
  if (op === 'renameCollection') return request.collection === undefined ? need('collection', op) : request.name === undefined ? need('name', op) : { op, collection: request.collection, name: request.name };
  if (op === 'deleteCollection') return request.collection === undefined ? need('collection', op) : { op, collection: request.collection };
  if (op === 'saveSearch') return request.name === undefined ? need('name', op) : request.query === undefined ? need('query', op) : { op, name: request.name, query: request.query };
  return request.search === undefined ? need('search', op) : { op: 'removeSearch', search: request.search };
};

const organise: ToolHandler = async (input, context) => {
  const request = input as OrganiseInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const assets = assetsOf(scope.value.visible, request);
  if ('error' in assets) return reply(assets);
  const op = opOf(request, assets);
  if ('error' in op) return reply(op);
  if (useProjectStore.getState().project?.manifest.projectId !== request.projectId) return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_OWNER, 'The owner has to open this project in Bxel first.'));
  const outcome = await editOrganise(op);
  if (!outcome.ok) return reply(mcpFailure(MCP_ERROR_CODE.COMMAND_REFUSED, outcome.message));
  const held = organiseOf(useProjectStore.getState().project?.manifest);
  return reply({
    ok: true,
    projectId: request.projectId,
    note: outcome.note,
    affected: assets.length,
    collections: held.collections.map((each) => ({ id: each.id, name: each.name, assets: each.assets.length })),
    searches: held.smart.map((each) => ({ id: each.id, name: each.name, query: each.query })),
  });
};

export { organise };
