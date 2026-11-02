/* @layer renderer-app @kind logic */
import { findBank, findSprite, flattenFrame } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import type { Clip } from '../editor/selection/selection.type';
import { currentArtwork } from '../sheet/current-artwork';
import { useDropLayerStore } from '../stores/useDropLayerStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { clipPicture } from './clip-picture';
import { CANVAS_DROP_TEXT } from './canvas-drop.constants';
import type { CanvasDropTarget } from './canvas-drop.type';
import type { SpritePair } from './sprite-layer-offer.type';

const clipOfSprite = (width: number, height: number, pixels: Uint8Array): Clip => ({
  width,
  height,
  origin: { x: 0, y: 0 },
  pixels,
  bits: Uint8Array.from(pixels, (value) => (value === 0 ? 0 : 1)),
});

const findPair = (artwork: Artwork | null, assetId: string, target: CanvasDropTarget): SpritePair | null => {
  const dropped = artwork ? findSprite(artwork, assetId as SpriteId) : undefined;
  const open = artwork && target.spriteId !== null ? findSprite(artwork, target.spriteId) : undefined;
  return dropped && open ? { dropped, open } : null;
};

const blockReason = (pair: SpritePair, target: CanvasDropTarget): string | null => {
  if (target.readOnly) return CANVAS_DROP_TEXT.readOnlyLayer;
  return pair.dropped.bankId === pair.open.bankId ? null : CANVAS_DROP_TEXT.otherPalette;
};

const spriteLayerOffer = (assetId: string, target: CanvasDropTarget): boolean => {
  const artwork = currentArtwork();
  const pair = findPair(artwork, assetId, target);
  const frame = pair?.dropped.frames[0];
  if (!artwork || !pair || !frame) return false;
  const reason = blockReason(pair, target);
  if (reason !== null) {
    useNoticeStore.getState().post(reason);
    return false;
  }
  const { dropped } = pair;
  const clip = clipOfSprite(dropped.width, dropped.height, flattenFrame(dropped, frame.id));
  const bank = findBank(artwork, dropped.bankId);
  useDropLayerStore.getState().show({ name: dropped.name, clip, picture: bank ? clipPicture(clip, bank) : null });
  return true;
};

export { spriteLayerOffer };
