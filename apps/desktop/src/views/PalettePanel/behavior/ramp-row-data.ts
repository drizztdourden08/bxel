/* @layer renderer-app @kind logic */
import type { Ramp } from '@bxel/document';
import type { RampReorder } from '../PalettePanel.type';

const rampRowData = (ramp: Ramp | null, reorder: RampReorder | undefined, position: number): Record<string, string | number | undefined> => {
  if (!ramp || !reorder) return {};
  return {
    'data-reorder-index': position,
    'data-reorder-key': ramp.id,
    'data-drop': reorder.drag.dropMark(position, reorder.total),
    'data-dragging': reorder.drag.dragging === position ? 'yes' : undefined,
  };
};

export { rampRowData };
