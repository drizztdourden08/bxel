/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { animationStep } from '../../timeline/animation-step';
import { currentFocus } from '../../timeline/current-focus';
import { currentTarget } from '../current-target';
import { fitClip } from './fit-clip';
import { FRAME_SPRITE_REF, SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';

const pasteAsFrame = (): boolean => {
  const clip = useSelectionStore.getState().clipboard;
  const target = currentTarget();
  if (!clip || !target) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  const focus = currentFocus();
  if (!focus) {
    useNoticeStore.getState().post(SELECTION_TEXT.noAnimation);
    return false;
  }
  const fitted = fitClip(clip, target.sprite);
  const at = focus.animation.frames.length;
  const steps: CommandStep[] = [
    animationStep(focus, COMMAND_NAME.animationFrameAdd, { source: { kind: 'empty', count: 1 }, at }),
    animationStep(focus, COMMAND_NAME.animationFrameOwn, { frame: { by: 'index', index: at } }, FRAME_SPRITE_REF),
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref: FRAME_SPRITE_REF }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width: fitted.clip.width, height: fitted.clip.height }, pixels: fitted.clip.pixels, skipZero: true },
    },
  ];
  if (fitted.cropped) useNoticeStore.getState().post(SELECTION_TEXT.pastedCropped);
  return runDocument(SELECTION_LABELS.pasteFrame, steps) !== null;
};

export { pasteAsFrame };
