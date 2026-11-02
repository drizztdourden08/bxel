/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { ARROW_STEPS } from '../../../keymap/arrow-steps.constants';
import { deletePickedPoint } from './delete-picked-point';
import { deletePickedShape } from './delete-picked-shape';
import { nudgePicked } from './nudge-picked';

const isDeleteKey = (key: string): boolean => key === 'Delete' || key === 'Backspace';

const deletePicked = (point: number | null): boolean => (point === null ? deletePickedShape() : deletePickedPoint());

const shapeKeyDown = (event: KeyboardEvent<HTMLCanvasElement>, point: number | null): void => {
  const step = ARROW_STEPS[event.key];
  const done = step ? nudgePicked(step[0], step[1], event.shiftKey) : false;
  const removed = isDeleteKey(event.key) ? deletePicked(point) : false;
  if (step || done || removed) event.preventDefault();
};

export { shapeKeyDown };
