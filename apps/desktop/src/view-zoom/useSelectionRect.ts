/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSurface } from '../hooks/useSurface';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import type { PixelRect } from '../views/PixelViewport';
import { selectionRect } from './selection-rect';

const useSelectionRect = (): PixelRect | null => {
  const surface = useSurface();
  const mask = useSelectionStore((state) => state.mask);
  const cells = useTilemapStore((state) => state.selection);
  // The rect reads the stores again, so the keys name what it depends on.
  return useMemo(() => selectionRect(), [surface, mask, cells]);
};

export { useSelectionRect };
