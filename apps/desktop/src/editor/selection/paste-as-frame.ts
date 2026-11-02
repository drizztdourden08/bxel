/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, TargetScope } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { fitClip } from './fit-clip';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';

const pasteAsFrame = (): boolean => {
  const clip = useSelectionStore.getState().clipboard;
  const target = currentTarget();
  if (!clip || !target) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  const { sprite, layerId } = target;
  const fitted = fitClip(clip, sprite);
  const added = sprite.frames.length;
  const scope: TargetScope = {
    sprites: [sprite.id],
    layers: { by: 'ids', ids: [layerId] },
    frames: { by: 'range', from: added, to: added },
  };
  const steps: CommandStep[] = [
    { name: COMMAND_NAME.frameAdd, targets: { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } }, options: {} },
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: scope,
      options: { rect: { x: 0, y: 0, width: fitted.clip.width, height: fitted.clip.height }, pixels: fitted.clip.pixels, skipZero: true },
    },
  ];
  if (fitted.cropped) useNoticeStore.getState().post(SELECTION_TEXT.pastedCropped);
  return runDocument(SELECTION_LABELS.pasteFrame, steps) !== null;
};

export { pasteAsFrame };
