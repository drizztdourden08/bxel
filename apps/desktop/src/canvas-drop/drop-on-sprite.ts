/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import { commands } from '@drizztdourden08/brock-react';
import type { DroppedFile } from '@drizztdourden08/brock-react';
import { dropKind } from '../file-ops/drop-kind';
import { dropImageAndPalettes } from '../file-ops/drop-image-and-palettes';
import { addReferenceFromFile } from '../reference-image/add-reference-from-file';
import { startSwitch } from '../palette-change/start-switch';
import { useNoticeStore } from '../stores/useNoticeStore';
import { CANVAS_DROP_TEXT } from './canvas-drop.constants';
import type { CanvasDropPayload, CanvasDropTarget } from './canvas-drop.type';
import { spriteLayerOffer } from './sprite-layer-offer';

const dropFilesOnSprite = (dropped: readonly DroppedFile[], defaults: AssetDefaults): void => {
  const files = dropped.map((each) => each.file);
  const reference = commands.heldModifiers().includes('alt') ? dropped.find((each) => dropKind(each.file) === 'image') : undefined;
  if (reference) {
    void addReferenceFromFile(reference.file, reference.path);
    return;
  }
  void dropImageAndPalettes(files, defaults);
};

const dropOnSprite = (payload: CanvasDropPayload, target: CanvasDropTarget, defaults: AssetDefaults): void => {
  if ('files' in payload) {
    dropFilesOnSprite(payload.files, defaults);
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
