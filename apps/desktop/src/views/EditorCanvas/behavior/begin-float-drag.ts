/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { autoPickLayer } from '../../../editor/auto-pick-layer';
import { floatOffset } from '../../../editor/pending/float-offset';
import { startMove } from '../../../editor/transform/start-move';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ActiveDrag } from './canvas-tools.type';
import { rawPixelAt } from './raw-pixel-at';

const beginFloatDrag = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): ActiveDrag | null => {
  const start = rawPixelAt(viewport, event);
  if (floatOffset() === null) autoPickLayer(start);
  if (floatOffset() === null && !startMove(event.altKey)) return null;
  const origin = floatOffset();
  return origin ? { kind: 'float', start, origin } : null;
};

export { beginFloatDrag };
