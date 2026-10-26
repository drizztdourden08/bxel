/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKey } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { openCreatedAsset } from '../new-sprite/open-created-asset';
import { runDocument } from '../sheet/run-document';
import { uniqueName } from '../sprite-name/unique-name';
import { useDocumentStore } from '../stores/useDocumentStore';
import { TIMELINE_LABEL, TIMELINE_REF } from './timeline.constants';

const makeAnimation = async (): Promise<string | null> => {
  const target = currentTarget();
  const { host, activeId } = useDocumentStore.getState();
  const artwork = activeId === null ? undefined : host.view(activeId)?.state.artwork;
  if (!target || target.sprite.role !== 'sprite' || !artwork || activeId === null) return null;
  const name = uniqueName(
    target.sprite.name,
    artwork.animations.map((animation) => animation.name),
  );
  const source = { kind: 'sprite', sprite: target.sprite.id, mode: 'reference' };
  const done = runDocument(TIMELINE_LABEL.make, [
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name, source }, ref: TIMELINE_REF.animation },
  ]);
  const id = done?.created[TIMELINE_REF.animation];
  if (id === undefined) return null;
  const key: AssetKey = { kind: 'animation', id };
  return openCreatedAsset(activeId, key);
};

export { makeAnimation };
