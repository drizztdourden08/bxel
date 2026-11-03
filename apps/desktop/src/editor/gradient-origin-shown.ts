/* @layer renderer-app @kind logic */
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';

const gradientOriginShown = (): boolean => useToolStore.getState().tool === 'gradient' && useDrawingStore.getState().gradientMode === 'dither';

export { gradientOriginShown };
