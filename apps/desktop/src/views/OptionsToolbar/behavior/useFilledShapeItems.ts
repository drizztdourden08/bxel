/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { FilledTool } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, FILL_COLOURS, HINTS } from '../DrawingOptions.constants';
import { plainGroup } from './plain-choices';

const FILLED: readonly string[] = ['rect', 'ellipse', 'curve', 'polygon', 'contour'];

const useFilledShapeItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const filledTools = useDrawingStore((state) => state.filled);
  const colour = useDrawingStore((state) => state.fillColour);
  const setFilled = useDrawingStore((state) => state.setFilled);
  const patch = useDrawingStore((state) => state.patch);
  if (!FILLED.includes(tool)) return [];
  const which = tool as FilledTool;
  const filled = filledTools[which];
  const items: ToolbarItem[] = [
    toggleItem({ id: 'shape-filled', icon: 'pixel-shape-rect-filled', hint: HINTS.filled, caption: DRAWING_TEXT.filled, pressed: filled, onChange: (on) => setFilled(which, on) }),
  ];
  if (filled) {
    items.push(plainGroup({ id: 'fill-colour', label: DRAWING_TEXT.fillColour, values: FILL_COLOURS, value: colour, onChange: (fillColour) => patch({ fillColour }) }));
  }
  return items;
};

export { useFilledShapeItems };
