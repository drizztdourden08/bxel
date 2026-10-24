/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { GRID_SELECTOR } from '../TimelinePanel.constants';
import { isField } from './is-field';
import { runKeyAction } from './run-key-action';
import { timelineKeyAction } from './timeline-key-action';

const useTimelineKeys = () => (event: KeyboardEvent<HTMLElement>): void => {
  if (isField(event.target)) return;
  const inGrid = event.target instanceof HTMLElement && event.target.closest(GRID_SELECTOR) !== null;
  const action = timelineKeyAction(event, inGrid);
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();
  runKeyAction(action);
};

export { useTimelineKeys };
