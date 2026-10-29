/* @layer renderer-app @kind logic */
import { endCurveDrag } from '../../../editor/end-curve-drag';
import type { PathSession } from '../../../editor/editor.type';
import { gesture } from '../../../editor/gesture-state';
import { cancelGesture } from './cancel-gesture';
import { finishGesture } from './finish-gesture';
import { gestureLive } from './gesture-live';

const stayed = (done: PathSession): boolean => {
  const first = done.vertices[0] ?? done.hover;
  return first.x === done.hover.x && first.y === done.hover.y;
};

const releasePath = (done: PathSession): void => {
  if (done.tool === 'contour') {
    finishGesture();
    return;
  }
  gestureLive.session = null;
  gesture.dragging = false;
  if (done.tool === 'curve') {
    if (stayed(done)) cancelGesture();
    else endCurveDrag(done);
  }
  gestureLive.redraw();
};

export { releasePath };
