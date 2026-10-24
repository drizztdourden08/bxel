/* @layer renderer-app @kind logic */
import { canSeeFolder } from '@bxel/mcp';
import type { AssetRow } from '../../asset-list/asset-list.type';
import { buildRows } from '../../asset-list/build-rows';
import { fileRows } from '../../asset-list/file-rows';
import { listProjectFiles } from '../../asset-list/list-project-files';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { isSamePath } from '@bxel/project';
import type { GrantedProject, ToolContext } from '../assistant.type';
import { locateInProject } from './locate-in-project';

const workspaceOf = (found: GrantedProject) => {
  if (!found.open) return undefined;
  return Object.values(useWorkspaceStore.getState().workspaces).find(
    (each) => each.kind === 'project' && isSamePath(each.projectFile ?? '', found.project.projectFile),
  );
};

const assistantRows = async (context: ToolContext, found: GrantedProject): Promise<readonly AssetRow[]> => {
  const { project } = found;
  const visible = project.folders.filter((folder) => folder.granted && canSeeFolder(project.manifest.assistant.folders, folder.folderId));
  const files = await listProjectFiles(context.documents, { ...project, folders: visible });
  const workspace = workspaceOf(found);
  const artwork = workspace ? useDocumentStore.getState().host.view(workspace.documentId)?.state.artwork : undefined;
  const rows = workspace && artwork ? buildRows({ workspace, artwork, files }) : fileRows(files, new Set(), project.manifest.name);
  return rows.filter((row) => row.path === '' || locateInProject(project, row.path) !== null);
};

export { assistantRows };
