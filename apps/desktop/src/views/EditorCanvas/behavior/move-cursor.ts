/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { announce } from '@drizztdourden08/brock-react';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import { cellColourName } from '../../../editor/cell-colour-name';
import { currentTarget } from '../../../editor/current-target';
import { stepCursor } from '../../../editor/step-cursor';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import type { KeyContext } from './canvas-tools.type';

const place = (at: Point, context: KeyContext): void => {
  useReadoutStore.getState().setPointer(at);
  context.viewport.current?.reveal(at);
  context.viewport.current?.redraw();
};

const moveCursor = (key: string, context: KeyContext): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { width, height } = target.sprite;
  const here = context.active.current ? useReadoutStore.getState().pointer : null;
  const start = here ?? useReadoutStore.getState().pointer ?? { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  const next = here === null ? start : stepCursor(here, key, target.sprite);
  if (!next) return false;
  context.active.current = true;
  place(next, context);
  const edge = here !== null && next.x === here.x && next.y === here.y;
  announce(edge ? ANNOUNCE_TEXT.edge : ANNOUNCE_TEXT.cellColour(next.x, next.y, cellColourName(target, next)));
  return true;
};

export { moveCursor };
