/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { floatOffset } from '../../../editor/pending/float-offset';
import { startMove } from '../../../editor/transform/start-move';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ActiveDrag } from './canvas-tools.type';
import { rawPixelAt } from './raw-pixel-at';

const beginFloatDrag = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): ActiveDrag | null => {
  if (floatOffset() === null && !startMove()) return null;
  const origin = floatOffset();
  return origin ? { kind: 'float', start: rawPixelAt(viewport, event), origin } : null;
};

export { beginFloatDrag };
