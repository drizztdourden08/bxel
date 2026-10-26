/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKey, SpriteId } from '@bxel/document';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { TIMELINE_REF } from '../timeline/timeline.constants';
import { COMPOSE_LABEL } from './compose-text.constants';
import type { AnimateSpec } from './compose.type';

const makeAnimationFrom = async (ids: readonly SpriteId[], name: string, spec: AnimateSpec): Promise<boolean> => {
  const documentId = useDocumentStore.getState().activeId;
  const source = { kind: 'sprites', sprites: ids, mode: spec.mode, durationMs: spec.durationMs };
  const step = { name: COMMAND_NAME.animationCreate, targets: null, options: { name, source }, ref: TIMELINE_REF.animation };
  const done = ids.length === 0 || documentId === null ? null : runDocument(COMPOSE_LABEL.merge(ids.length), [step]);
  const id = done?.created[TIMELINE_REF.animation];
  if (id === undefined || currentArtwork() === null || documentId === null) return false;
  const key: AssetKey = { kind: 'animation', id };
  await openCreatedAsset(documentId, key);
  return true;
};

export { makeAnimationFrom };
