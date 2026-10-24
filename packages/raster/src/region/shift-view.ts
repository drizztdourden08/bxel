/* @layer core @kind logic */
import { trimPivot } from '@bxel/document';
import type { Rect } from '../geometry.type';
import { padMask } from './pad-mask';
import type { MoverView } from './region.type';

const shiftView = (view: MoverView, frame: Rect): MoverView => ({
  mask: padMask(view.mask, frame),
  box: { ...view.box, x: view.box.x - frame.x, y: view.box.y - frame.y },
  pivot: trimPivot(view.pivot, frame),
});

export { shiftView };
