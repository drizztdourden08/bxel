/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { SPRAY_LIMITS } from '../../../stores/drawing-store.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { hintFace, toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, HINTS } from '../DrawingOptions.constants';

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, Math.trunc(value)));

const useSprayItems = (): ToolbarItem[] => {
  const size = useDrawingStore((state) => state.spraySize);
  const density = useDrawingStore((state) => state.sprayDensity);
  const seed = useDrawingStore((state) => state.spraySeed);
  const patch = useDrawingStore((state) => state.patch);
  return [
    { kind: 'number', id: 'spray-size', ...hintFace(HINTS.spraySize), min: SPRAY_LIMITS.sizeMin, max: SPRAY_LIMITS.sizeMax, step: 1, value: size, onChange: (value) => patch({ spraySize: clamp(value, SPRAY_LIMITS.sizeMin, SPRAY_LIMITS.sizeMax) }) },
    { kind: 'number', id: 'spray-density', ...hintFace(HINTS.sprayDensity), min: SPRAY_LIMITS.densityMin, max: SPRAY_LIMITS.densityMax, step: 1, value: density, onChange: (value) => patch({ sprayDensity: clamp(value, SPRAY_LIMITS.densityMin, SPRAY_LIMITS.densityMax) }) },
    toggleItem({ id: 'spray-seed', icon: 'pixel-lock', hint: HINTS.spraySeed, caption: DRAWING_TEXT.spraySeed, pressed: seed !== null, onChange: (on) => patch({ spraySeed: on ? 1 : null }) }),
  ];
};

export { useSprayItems };
