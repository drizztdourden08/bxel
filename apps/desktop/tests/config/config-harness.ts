/* @layer renderer-app @kind test */
import type { Artwork, DocumentId, Sprite } from '@bxel/document';
import { decodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { openSampleProject } from '../workspace/open-sample-project';

type OpenRig = { readonly held: Rig; readonly documentId: DocumentId; readonly paths: ReadonlyMap<string, string>; readonly artwork: Artwork };

const openedProject = async (): Promise<OpenRig> => {
  const held = rig();
  return { held, ...(await openSampleProject(held)) };
};

const liveArtwork = (documentId: DocumentId): Artwork => {
  const found = useDocumentStore.getState().host.view(documentId)?.state.artwork;
  if (!found) throw new Error('no document');
  return found;
};

const firstSprite = (documentId: DocumentId): Sprite => {
  const sprite = liveArtwork(documentId).sprites[0];
  if (!sprite) throw new Error('no sprite');
  return sprite;
};

const undoOnce = (documentId: DocumentId): void => {
  useDocumentStore.getState().host.undo(documentId);
};

const revisionOf = (documentId: DocumentId): number => useDocumentStore.getState().host.view(documentId)?.state.revision ?? 0;

const savedManifest = (held: Rig): ProjectDocument => {
  const bytes = held.disk.files.get('C:/Art/Dungeon/Dungeon.bxproject');
  if (!(bytes instanceof Uint8Array)) throw new Error('the project file is missing');
  const decoded = decodeProject(bytes);
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded.value.manifest;
};

export { firstSprite, liveArtwork, openedProject, revisionOf, savedManifest, undoOnce };
