/* @layer renderer-app @kind logic */
import { reorderStep } from '@drizztdourden08/tessera';
import type { KeyboardEvent } from 'react';
import type { RampReorder } from '../PalettePanel.type';

const rampRowKeyDown = (event: KeyboardEvent<HTMLElement>, reorder: RampReorder, index: number): void => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key === 'Escape') reorder.drag.cancel();
  const to = reorderStep(event, { axis: 'vertical', chord: 'alt', index, total: reorder.total });
  if (to === undefined) return;
  event.preventDefault();
  reorder.move(index, to);
};

export { rampRowKeyDown };
