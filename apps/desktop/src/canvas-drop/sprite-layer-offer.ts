/* @layer renderer-app @kind logic */
import { findBank, findSprite, flattenFrame } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import type { Clip } from '../editor/selection/selection.type';
import { currentArtwork } from '../sheet/current-artwork';
import { useDropLayerStore } from '../stores/useDropLayerStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { clipPicture } from './clip-picture';
import { CANVAS_DROP_TEXT } from './canvas-drop.constants';
import type { CanvasDropTarget } from './canvas-drop.type';

const clipOfSprite = (width: number, height: number, pixels: Uint8Array): Clip => ({
  width,
  height,
  origin: { x: 0, y: 0 },
  pixels,
  bits: Uint8Array.from(pixels, (value) => (value === 0 ? 0 : 1)),
});

const spriteLayerOffer = (assetId: string, target: CanvasDropTarget): boolean => {
  const notices = useNoticeStore.getState();
  const artwork = currentArtwork();
  const dropped = artwork ? findSprite(artwork, assetId as SpriteId) : undefined;
  const open = artwork && target.spriteId !== null ? findSprite(artwork, target.spriteId) : undefined;
  const frame = dropped?.frames[0];
  if (!dropped || !open || !frame) return false;
  if (target.readOnly) {
    notices.post(CANVAS_DROP_TEXT.readOnlyLayer);
    return false;
  }
  if (dropped.bankId !== open.bankId) {
    notices.post(CANVAS_DROP_TEXT.otherPalette);
    return false;
  }
  const clip = clipOfSprite(dropped.width, dropped.height, flattenFrame(dropped, frame.id));
  const bank = findBank(artwork, dropped.bankId);
  useDropLayerStore.getState().show({ name: dropped.name, clip, picture: bank ? clipPicture(clip, bank) : null });
  return true;
};

export { spriteLayerOffer };
