/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { isSamePath } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { placePath } from './place-path';
import type { FilePlace } from './project-files-input.type';

const idAt = (project: OpenProject, path: string): string | undefined => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project' && isSamePath(each.projectFile ?? '', project.projectFile));
  return [...(workspace?.paths ?? [])].find(([, held]) => isSamePath(held, path))?.[0];
};

const assetIdsOf = (project: OpenProject, files: readonly FilePlace[], assets: readonly string[]): McpResult<readonly string[]> => {
  const ids = new Set(assets);
  for (const [at, place] of files.entries()) {
    const path = placePath(project, place, `files.${at}`);
    if (!path.ok) return path;
    const id = idAt(project, path.value);
    if (id === undefined) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, 'That file is not an asset of the open project.', { path: `files.${at}.path` });
    ids.add(id);
  }
  return { ok: true, value: [...ids] };
};

export { assetIdsOf };
