/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, GRADIENT_KINDS, GRADIENT_MODES, GRADIENT_PATTERN_LABELS, HINTS } from '../DrawingOptions.constants';
import { plainGroup } from './plain-choices';
import { patternItem } from './pattern-item';

const useGradientItems = (): ToolbarItem[] => {
  const kind = useDrawingStore((state) => state.gradientKind);
  const mode = useDrawingStore((state) => state.gradientMode);
  const reflect = useDrawingStore((state) => state.gradientReflect);
  const pattern = useDrawingStore((state) => state.gradientPattern);
  const patch = useDrawingStore((state) => state.patch);
  const items: ToolbarItem[] = [
    plainGroup({ id: 'gradient-kind', label: DRAWING_TEXT.gradientKind, values: GRADIENT_KINDS, value: kind, onChange: (gradientKind) => patch({ gradientKind }) }),
    plainGroup({ id: 'gradient-mode', label: DRAWING_TEXT.gradientMode, values: GRADIENT_MODES, value: mode, onChange: (gradientMode) => patch({ gradientMode }) }),
  ];
  if (mode === 'dither') items.push(patternItem(pattern, GRADIENT_PATTERN_LABELS, (gradientPattern) => patch({ gradientPattern })));
  items.push(toggleItem({ id: 'gradient-reflect', icon: 'pixel-loop', hint: HINTS.reflect, caption: DRAWING_TEXT.gradientReflect, pressed: reflect, onChange: (gradientReflect) => patch({ gradientReflect }) }));
  return items;
};

export { useGradientItems };
