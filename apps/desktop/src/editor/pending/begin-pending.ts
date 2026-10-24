/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { MaskView } from '@bxel/raster';
import { currentScene } from '../../sheet/current-scene';
import { groupSprites } from '../../sheet/group-sprites';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { usePendingStore } from '../../stores/usePendingStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import { layerBlock } from '../layer-block';
import { selectionMask } from '../selection/selection-mask';
import type { PendingEdit, PendingSpec } from './pending.type';
import { wholeSprite } from './whole-sprite';

const maskFor = (spec: PendingSpec, found: MaskView | null): MaskView | null => (spec.kind === 'paste' ? null : found);

const spritesFor = (pending: Omit<PendingEdit, 'sprites'>, active: SpriteId): readonly SpriteId[] => {
  const scene = currentScene();
  if (!scene || !wholeSprite({ ...pending, sprites: [active] })) return [active];
  const group = groupSprites(scene, useSpriteStore.getState().spritesScope);
  return group.length > 1 ? group.map((sprite) => sprite.id) : [active];
};

const beginPending = (spec: PendingSpec, editing = false): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const base = { documentId: target.documentId, spec, mask: maskFor(spec, selectionMask(target)), editing };
  const pending: PendingEdit = { ...base, sprites: spritesFor(base, target.sprite.id) };
  const blocked = wholeSprite(pending) ? null : layerBlock(target.layer);
  if (blocked !== null) {
    useNoticeStore.getState().post(blocked);
    return false;
  }
  usePendingStore.getState().begin(pending);
  return true;
};

export { beginPending };
