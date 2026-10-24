/* @layer renderer-app @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { decodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';

type OpenRig = { readonly held: Rig; readonly documentId: DocumentId; readonly paths: ReadonlyMap<string, string>; readonly artwork: Artwork };

const openedProject = async (): Promise<OpenRig> => {
  const held = rig();
  const artwork = sampleArtwork();
  const paths = writeProjectAssets(held.disk, ROOT, artwork);
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  await openProject();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  held.disk.writes.length = 0;
  return { held, documentId: workspace.documentId, paths, artwork };
};

const liveArtwork = (documentId: DocumentId): Artwork => {
  const found = useDocumentStore.getState().host.view(documentId)?.state.artwork;
  if (!found) throw new Error('no document');
  return found;
};

const savedManifest = (held: Rig): ProjectDocument => {
  const bytes = held.disk.files.get(`${ROOT}/Dungeon.bxproject`);
  if (!(bytes instanceof Uint8Array)) throw new Error('the project file is missing');
  const decoded = decodeProject(bytes);
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded.value.manifest;
};

export { liveArtwork, openedProject, savedManifest };
