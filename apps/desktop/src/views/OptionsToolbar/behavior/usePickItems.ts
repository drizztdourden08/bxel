/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { DRAWING_TEXT, PICK_SAMPLES } from '../DrawingOptions.constants';
import { plainGroup } from './plain-choices';

const usePickItems = (): ToolbarItem[] => {
  const value = useDrawingStore((state) => state.pickSample);
  const patch = useDrawingStore((state) => state.patch);
  return [plainGroup({ id: 'pick-sample', label: DRAWING_TEXT.pickSample, values: PICK_SAMPLES, value, onChange: (pickSample) => patch({ pickSample }) })];
};

export { usePickItems };
