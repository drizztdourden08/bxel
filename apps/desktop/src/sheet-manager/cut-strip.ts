/* @layer renderer-app @kind logic */
import type { AssetKey, SpriteId } from '@bxel/document';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { runDocument } from '../sheet/run-document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { TIMELINE_REF } from '../timeline/timeline.constants';
import { COMPOSE_LABEL } from './compose-text.constants';
import type { CutStripSpec } from './compose.type';
import { cutStripSteps } from './cut-strip-steps';

const cutStrip = async (sprite: SpriteId, name: string, spec: CutStripSpec): Promise<boolean> => {
  const documentId = useDocumentStore.getState().activeId;
  const done = documentId === null ? null : runDocument(COMPOSE_LABEL.strip, cutStripSteps(sprite, name, spec));
  const id = done?.created[TIMELINE_REF.animation];
  if (id === undefined || documentId === null) return false;
  const key: AssetKey = { kind: 'animation', id };
  await openCreatedAsset(documentId, key);
  return true;
};

export { cutStrip };
