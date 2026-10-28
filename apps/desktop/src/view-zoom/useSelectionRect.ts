/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useCanvasSurface } from '../canvas-surface/useCanvasSurface';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import type { PixelRect } from '../views/PixelViewport';
import { selectionRect } from './selection-rect';

const useSelectionRect = (): PixelRect | null => {
  const surface = useCanvasSurface();
  const mask = useSelectionStore((state) => state.mask);
  const cells = useTilemapStore((state) => state.selection);
  return useMemo(() => selectionRect(), [surface, mask, cells]);
};

export { useSelectionRect };
