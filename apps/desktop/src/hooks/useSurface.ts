/* @layer renderer-app @kind hook */
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { surfaceOf } from '../surface/surface-of';
import type { Surface } from '../surface/surface.type';
import { useActiveDocument } from './useActiveDocument';

const useSurface = (): Surface => {
  const present = useActiveDocument() !== null;
  const mode = useSpriteStore((state) => state.mode);
  const tileMode = useTilemapStore((state) => state.editMode);
  return surfaceOf(present, mode, tileMode);
};

export { useSurface };
