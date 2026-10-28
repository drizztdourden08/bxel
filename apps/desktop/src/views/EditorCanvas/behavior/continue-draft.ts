/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { addVertex } from '../../../editor/add-vertex';
import type { PathSession } from '../../../editor/editor.type';
import { hoverPath } from '../../../editor/hover-path';
import { finishGesture } from './finish-gesture';
import type { DraftClick as Click } from './draft-click.type';
import { gestureLive } from './gesture-live';

const continueDraft = (draft: PathSession, at: Point, click: Click): void => {
  if (draft.tool === 'polygon') {
    if (click.detail >= 2) finishGesture();
    else addVertex(draft, at, click.shiftKey);
  } else if (draft.tool === 'curve') {
    hoverPath(draft, at, false);
    finishGesture();
  }
  gestureLive.redraw();
};

export { continueDraft };
