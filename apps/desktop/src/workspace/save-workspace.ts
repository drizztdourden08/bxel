/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { failed } from '../files/failed';
import { CANCELLED } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { dirtyKeys } from './dirty-keys';
import { firstSaveProblem } from './first-save-problem';
import { givePaths } from './give-paths';
import { saveProjectFile } from './save-project-file';
import { settleEngine } from './settle-engine';
import { trashRemoved } from './trash-removed';
import { WORKSPACE_TEXT } from './workspace.constants';
import { workspaceTarget } from './workspace-target';
import type { Workspace, WorkspaceTarget } from './workspace.type';
import { writeAssets } from './write-assets';

const outcomeOf = (workspace: Workspace, counts: { readonly saved: number; readonly trashed: number }, first: string | undefined): FileOutcome => ({
  kind: 'done',
  path: workspace.projectFile ?? first ?? '',
  notice: counts.saved + counts.trashed === 0 ? WORKSPACE_TEXT.nothingToSave : WORKSPACE_TEXT.saved(counts.saved),
});

const writeAll = async (kit: FileKit, target: WorkspaceTarget): Promise<FileOutcome> => {
  const { documentId } = target.workspace;
  const workspace = useWorkspaceStore.getState().workspaces[documentId] ?? target.workspace;
  const artwork = kit.host.view(documentId)?.state.artwork ?? target.view.state.artwork;
  const keys = dirtyKeys(workspace, artwork);
  const problem = firstSaveProblem(artwork, keys.live, workspace.paths);
  if (problem !== null) return failed(WORKSPACE_TEXT.saveFailed(problem.name, problem.reason));
  const trashed = keys.gone.length > 0 ? (await trashRemoved(kit, documentId, keys.gone)).length : 0;
  const written = await writeAssets(kit, documentId, keys.live);
  const project = await saveProjectFile(kit, documentId, workspace, keys);
  settleEngine(kit.host, documentId);
  if (typeof project === 'string') return failed(project);
  return outcomeOf(workspace, { saved: written.length + project, trashed }, written[0]?.path);
};

const saveWorkspace = async (kit: FileKit, documentId: DocumentId): Promise<FileOutcome> => {
  const target = workspaceTarget(kit, documentId);
  if ('kind' in target) return target;
  if (!(await givePaths(kit, documentId, dirtyKeys(target.workspace, target.view.state.artwork).live))) return CANCELLED;
  return writeAll(kit, target);
};

export { saveWorkspace };
