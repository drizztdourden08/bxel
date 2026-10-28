/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { DRAWING_TEXT, FILL_MATCHES, FILL_SAMPLES } from '../DrawingOptions.constants';
import { plainGroup } from './plain-choices';

const useFillExtraItems = (): ToolbarItem[] => {
  const sample = useDrawingStore((state) => state.fillSample);
  const match = useDrawingStore((state) => state.fillMatch);
  const patch = useDrawingStore((state) => state.patch);
  return [
    plainGroup({ id: 'fill-sample', label: DRAWING_TEXT.fillSample, values: FILL_SAMPLES, value: sample, onChange: (fillSample) => patch({ fillSample }) }),
    plainGroup({ id: 'fill-match', label: DRAWING_TEXT.fillMatch, values: FILL_MATCHES, value: match, onChange: (fillMatch) => patch({ fillMatch }) }),
  ];
};

export { useFillExtraItems };
