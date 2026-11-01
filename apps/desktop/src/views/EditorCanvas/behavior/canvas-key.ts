/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { gesture } from '../../../editor/gesture-state';
import { ARROW_DELTAS } from '../../../editor/selection/selection.constants';
import { sliceKey } from '../../../slice/slice-key';
import { nudgeOffset } from '../../../timeline/nudge-offset';
import { nudgeStep } from '../../../editor/transform/nudge-step';
import { nudgeKey } from '../../../editor/transform/nudge-key';
import { PRESS_KEYS } from './canvas-key.constants';
import type { KeyContext } from './canvas-tools.type';
import { moveCursor } from './move-cursor';
import { pressKey } from './press-key';

const plain = (event: KeyboardEvent<HTMLElement>): boolean => !event.altKey && !event.metaKey;

const handles = (event: KeyboardEvent<HTMLElement>, context: KeyContext): boolean => {
  if (event.key in ARROW_DELTAS) return !event.ctrlKey && !event.shiftKey && moveCursor(event.key, context);
  if (event.key === 'Escape') {
    context.anchor.current = null;
    context.points.current = [];
  }
  const pressing = PRESS_KEYS.includes(event.key) && (event.key === 'Enter' || context.active.current);
  return pressing && pressKey(event, context);
};

const frameNudge = (event: KeyboardEvent<HTMLElement>): boolean => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || !event.altKey || event.ctrlKey || event.metaKey) return false;
  const step = nudgeStep(event.shiftKey);
  return nudgeOffset(delta.x * step, delta.y * step);
};

const canvasKey = (event: KeyboardEvent<HTMLElement>, context: KeyContext): void => {
  if (sliceKey(event.key)) {
    event.preventDefault();
    return;
  }
  if (event.key === ' ' && gesture.dragging) {
    event.preventDefault();
    return;
  }
  if (frameNudge(event)) {
    event.preventDefault();
    return;
  }
  nudgeKey(event);
  if (event.defaultPrevented || !plain(event)) return;
  if (handles(event, context)) event.preventDefault();
};

export { canvasKey };
