/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { MaskView } from '@bxel/raster';
import { currentScene } from '../../sheet/current-scene';
import { groupSprites } from '../../sheet/group-sprites';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { usePendingStore } from '../../stores/usePendingStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import type { EditorTarget } from '../editor.type';
import { layerBlock } from '../layer-block';
import { editMask } from '../edit-mask';
import type { PendingEdit, PendingSpec } from './pending.type';
import { wholeSprite } from './whole-sprite';

const maskFor = (spec: PendingSpec, found: MaskView | null): MaskView | null => (spec.kind === 'paste' ? null : found);

const spritesFor = (pending: Omit<PendingEdit, 'sprites'>, active: SpriteId): readonly SpriteId[] => {
  const scene = currentScene();
  if (!scene || !wholeSprite({ ...pending, sprites: [active] })) return [active];
  const group = groupSprites(scene, useSpriteStore.getState().spritesScope);
  return group.length > 1 ? group.map((sprite) => sprite.id) : [active];
};

type Built = { readonly target: EditorTarget; readonly pending: PendingEdit; readonly blocked: string | null };

const buildPending = (spec: PendingSpec, editing: boolean): Built | null => {
  const target = currentTarget();
  if (!target) return null;
  const base = { documentId: target.documentId, spec, mask: maskFor(spec, editMask(target)), editing };
  const pending: PendingEdit = { ...base, sprites: spritesFor(base, target.sprite.id) };
  return { target, pending, blocked: wholeSprite(pending) ? null : layerBlock(target.layer) };
};

const beginPending = (spec: PendingSpec, editing = false): boolean => {
  const built = buildPending(spec, editing);
  if (!built) return false;
  if (built.blocked !== null) {
    useNoticeStore.getState().post(built.blocked);
    return false;
  }
  usePendingStore.getState().begin(built.pending);
  return true;
};

export { beginPending, buildPending };
