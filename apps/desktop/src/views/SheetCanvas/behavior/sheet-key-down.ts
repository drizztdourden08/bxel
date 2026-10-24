/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { ARROW_DELTAS, NUDGE_STEP, NUDGE_STEP_FAST } from '../../../editor/selection/selection.constants';
import { currentScene } from '../../../sheet/current-scene';
import { placeSprites } from '../../../sheet/place-sprites';
import { selectionIds } from '../../../sheet/selection-ids';

const sheetKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
  const arrow = ARROW_DELTAS[event.key];
  const scene = currentScene();
  if (!arrow || !scene || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = event.shiftKey ? NUDGE_STEP_FAST : NUDGE_STEP;
  event.preventDefault();
  placeSprites(selectionIds(scene), { x: arrow.x * step, y: arrow.y * step });
};

export { sheetKeyDown };
