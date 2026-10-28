/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { CORNER_RADIUS } from '../../../stores/drawing-store.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { hintFace, toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, HINTS } from '../DrawingOptions.constants';

const useShapeExtraItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const radius = useDrawingStore((state) => state.cornerRadius);
  const even = useDrawingStore((state) => state.evenSteps);
  const curvePerfect = useDrawingStore((state) => state.curvePerfect);
  const contourPerfect = useDrawingStore((state) => state.contourPerfect);
  const patch = useDrawingStore((state) => state.patch);
  if (tool === 'rect') {
    return [{ kind: 'number', id: 'corner-radius', ...hintFace(HINTS.radius), min: CORNER_RADIUS.min, max: CORNER_RADIUS.max, step: 1, value: radius, onChange: (value) => patch({ cornerRadius: Math.min(CORNER_RADIUS.max, Math.max(CORNER_RADIUS.min, Math.trunc(value))) }) }];
  }
  if (tool === 'line') {
    return [toggleItem({ id: 'even-steps', icon: 'pixel-shape-line', hint: HINTS.evenSteps, caption: DRAWING_TEXT.evenSteps, pressed: even, onChange: (evenSteps) => patch({ evenSteps }) })];
  }
  if (tool === 'curve') {
    return [toggleItem({ id: 'curve-perfect', icon: 'pixel-pixel-perfect', hint: HINTS.perfect, caption: DRAWING_TEXT.perfect, pressed: curvePerfect, onChange: (on) => patch({ curvePerfect: on }) })];
  }
  if (tool === 'contour') {
    return [toggleItem({ id: 'contour-perfect', icon: 'pixel-pixel-perfect', hint: HINTS.perfect, caption: DRAWING_TEXT.perfect, pressed: contourPerfect, onChange: (on) => patch({ contourPerfect: on }) })];
  }
  return [];
};

export { useShapeExtraItems };
