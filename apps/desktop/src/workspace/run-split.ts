/* @layer renderer-app @kind logic */
import type { Artwork, DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { reasonOf } from '../files/reason-of';
import { leaveProject } from '../project/leave-project';
import { openProject } from '../project/open-project';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { fileKit } from '../files/file-kit';
import { parentOf } from './parent-of';
import { splitBeside } from './split-beside';
import { splitIntoProject } from './split-into-project';
import { SPLIT_TEXT } from './workspace.constants';
import type { LegacySource, SplitDestination, SplitOutcome } from './workspace.type';

const intoProject = async (kit: FileKit, artwork: Artwork): Promise<SplitOutcome> => {
  const { project } = useProjectStore.getState();
  if (!project) return { kind: 'failed', message: SPLIT_TEXT.noProject };
  return (await splitIntoProject(kit, artwork, project)) ? { kind: 'done' } : { kind: 'cancelled' };
};

const beside = async (kit: FileKit, artwork: Artwork, legacy: LegacySource): Promise<SplitOutcome> => {
  const parent = await kit.documents.openFolder({ title: SPLIT_TEXT.pickParent, defaultPath: parentOf(legacy.path) });
  if (parent === null || !(await leaveProject(null))) return { kind: 'cancelled' };
  const root = await splitBeside(kit, artwork, parent);
  await openProject(root, true);
  return { kind: 'done' };
};

const runSplit = async (documentId: DocumentId, destination: SplitDestination): Promise<SplitOutcome> => {
  const kit = fileKit();
  const legacy = useWorkspaceStore.getState().workspaces[documentId]?.legacy;
  const artwork = kit?.host.view(documentId)?.state.artwork;
  if (!kit || !legacy || !artwork) return { kind: 'failed', message: SPLIT_TEXT.unavailable };
  try {
    const outcome = destination === 'project' ? await intoProject(kit, artwork) : await beside(kit, artwork, legacy);
    if (outcome.kind === 'done') kit.host.close(documentId);
    return outcome;
  } catch (error) {
    return { kind: 'failed', message: SPLIT_TEXT.failed(reasonOf(error)) };
  }
};

export { runSplit };
