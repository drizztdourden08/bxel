/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import { dropKind } from '../file-ops/drop-kind';
import { dropPalette } from '../file-ops/drop-palette';
import { dropImage } from '../image-import/drop-image';
import { startSwitch } from '../palette-change/start-switch';
import { useNoticeStore } from '../stores/useNoticeStore';
import { CANVAS_DROP_TEXT } from './canvas-drop.constants';
import type { CanvasDropPayload, CanvasDropTarget } from './canvas-drop.type';
import { spriteLayerOffer } from './sprite-layer-offer';

const dropFilesOnSprite = (files: readonly File[], defaults: AssetDefaults): void => {
  const image = files.find((file) => dropKind(file) === 'image');
  if (image) void dropImage(image);
  for (const file of files.filter((each) => dropKind(each) === 'palette')) void dropPalette(file, defaults);
};

const dropOnSprite = (payload: CanvasDropPayload, target: CanvasDropTarget, defaults: AssetDefaults): void => {
  if ('files' in payload) {
    dropFilesOnSprite(payload.files.map((each) => each.file), defaults);
    return;
  }
  const sprite = payload.find((asset) => asset.kind === 'sprite' && asset.assetId !== null);
  if (sprite?.assetId) {
    spriteLayerOffer(sprite.assetId, target);
    return;
  }
  const palette = payload.find((asset) => asset.kind === 'palette' && asset.assetId !== null);
  if (!palette?.assetId || target.spriteId === null) return;
  if (target.readOnly) {
    useNoticeStore.getState().post(CANVAS_DROP_TEXT.readOnly);
    return;
  }
  startSwitch(target.spriteId, palette.assetId as BankId);
};

export { dropOnSprite };
