/* @layer renderer-app @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { sampleArtwork, writeProjectAssets } from './workspace-harness';

type SampleProject = {
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
  readonly documentId: DocumentId;
};

const openSampleProject = async (held: Rig): Promise<SampleProject> => {
  const artwork = sampleArtwork();
  const paths = writeProjectAssets(held.disk, ROOT, artwork);
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  await openProject();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  held.disk.writes.length = 0;
  return { artwork, paths, documentId: workspace.documentId };
};

const workspaceOf = (documentId: DocumentId) => {
  const found = useWorkspaceStore.getState().workspaces[documentId];
  if (!found) throw new Error('no workspace');
  return found;
};

const artworkOf = (documentId: DocumentId) => {
  const found = useDocumentStore.getState().host.view(documentId)?.state.artwork;
  if (!found) throw new Error('no document');
  return found;
};

export { artworkOf, openSampleProject, workspaceOf };
