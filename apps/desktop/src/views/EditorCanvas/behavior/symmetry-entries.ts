/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { useToolStore } from '../../../stores/useToolStore';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { CANVAS_MENU } from '../EditorCanvas.constants';

const symmetryEntries = (here: Point | null): ContextMenuEntry => {
  const { symmetryX, symmetryY } = useToolStore.getState();
  return {
    label: CANVAS_MENU.symmetry,
    items: [
      COMMAND_ID.symmetryX,
      COMMAND_ID.symmetryY,
      { command: 'symmetry.axis_here', label: CANVAS_MENU.axisX, args: { axis: 'x', position: (here?.x ?? 0) + 0.5 }, hidden: here === null },
      { command: 'symmetry.axis_here', label: CANVAS_MENU.axisY, args: { axis: 'y', position: (here?.y ?? 0) + 0.5 }, hidden: here === null },
      { command: 'symmetry.axis_centre', label: CANVAS_MENU.axisCentre, ...unless(symmetryX || symmetryY, CANVAS_MENU.symmetryOff) },
    ],
  };
};

export { symmetryEntries };
