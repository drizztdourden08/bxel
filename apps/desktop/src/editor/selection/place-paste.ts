/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useReadoutStore } from '../../stores/useReadoutStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import type { EditorTarget } from '../editor.type';
import { beginPending } from '../pending/begin-pending';
import { fitOffset } from '../pending/fit-offset';
import { fitClip } from './fit-clip';
import { SELECTION_TEXT } from './selection.constants';
import type { Clip } from './selection.type';

const centredOffset = (clip: Clip, at: Point | null, target: EditorTarget): Point => {
  const centre = at ?? { x: Math.floor(target.sprite.width / 2), y: Math.floor(target.sprite.height / 2) };
  return { x: centre.x - Math.floor(clip.width / 2) - clip.origin.x, y: centre.y - Math.floor(clip.height / 2) - clip.origin.y };
};

const placePaste = (inPlace: boolean): boolean => {
  const held = useSelectionStore.getState().clipboard;
  const target = currentTarget();
  const notices = useNoticeStore.getState();
  if (!held || !target) {
    notices.post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  const { clip, cropped } = fitClip(held, target.sprite);
  if (cropped) notices.post(SELECTION_TEXT.pastedCropped);
  const wanted = inPlace || cropped ? { x: 0, y: 0 } : centredOffset(clip, useReadoutStore.getState().pointer, target);
  return beginPending({ kind: 'paste', clip, offset: fitOffset(clip, wanted, target.sprite) });
};

export { placePaste };
