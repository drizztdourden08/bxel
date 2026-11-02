/* @layer renderer-app @kind test */
import type { Artwork, DocumentId, Sprite, TagId } from '@bxel/document';
import { decodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { COMMAND_NAME } from '@bxel/document';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
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

const focusNewAnimation = (documentId: DocumentId, frames: number): string => {
  const made = runSteps(useDocumentStore.getState().host, documentId, 'Animation', [
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'blank', width: 8, height: 8, frames } }, ref: 'anim' },
  ]);
  if (!made.ok) throw new Error(made.error.message);
  const id = made.created['anim'] ?? '';
  focusTab(tabOf(documentId, { kind: 'animation', id }));
  return id;
};

const addSpanTag = (documentId: DocumentId, animation: string): void => {
  const first = liveArtwork(documentId).animations[0]?.frames[0]?.id ?? '';
  const added = runSteps(useDocumentStore.getState().host, documentId, 'Tag', [
    { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'span', name: 'idle', from: { by: 'id', id: first }, to: { by: 'id', id: first } }, ref: 'tag' },
  ]);
  if (!added.ok) throw new Error(added.error.message);
};

const firstTagId = (documentId: DocumentId): TagId => {
  const id = liveArtwork(documentId).animations[0]?.tags[0]?.id;
  if (id === undefined) throw new Error('No tag.');
  return id;
};

export { addSpanTag, firstSprite, firstTagId, focusNewAnimation, liveArtwork, openedProject, revisionOf, savedManifest, undoOnce };

