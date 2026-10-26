/* @layer renderer-app @kind logic */
import { clampAxis } from '../../../editor/clamp-axis';
import type { RulerSpan } from '../../../ruler/ruler.type';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { useToolStore } from '../../../stores/useToolStore';

const rulerAxisState = (axis: SymmetryAxis, span: RulerSpan): { handle: number | null; centred: boolean } => {
  const tools = useToolStore.getState();
  const on = axis === 'x' ? tools.symmetryX : tools.symmetryY;
  const placed = axis === 'x' ? tools.axisX : tools.axisY;
  return { handle: on ? clampAxis(placed, span.count) : null, centred: clampAxis(placed, span.count) === span.count };
};

export { rulerAxisState };
