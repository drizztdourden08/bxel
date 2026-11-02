/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import type { Point } from '@bxel/raster';
import type { PaintSession } from '../../../editor/editor.type';
import { extendStroke } from '../../../editor/extend-stroke';
import { hoverPath } from '../../../editor/hover-path';
import { moveSpray } from '../../../editor/move-spray';
import { updateGradient } from '../../../editor/update-gradient';
import { updateShape } from '../../../editor/update-shape';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useGestureStore } from '../../../stores/useGestureStore';
import { shapeMods } from './shape-mods';
import { penPressure } from './pen-pressure';

const moveSession = (session: PaintSession, at: Point, event: PointerEvent<HTMLElement>): void => {
  const hint = useGestureStore.getState();
  switch (session.kind) {
    case 'stroke':
      extendStroke(session, at);
      return;
    case 'shape':
      updateShape(session, at, shapeMods(event));
      hint.setHint(session.label);
      return;
    case 'path':
      hoverPath(session, at, event.shiftKey);
      return;
    case 'gradient':
      updateGradient(session, at, event.shiftKey);
      hint.setHint(session.label);
      return;
    case 'spray':
      moveSpray(session, at, useDrawingStore.getState().sprayPressure ? penPressure(event) : 1);
      break;
  }
};

export { moveSession };
