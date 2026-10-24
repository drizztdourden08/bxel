/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { editorMenu } from '../menu/editor-menu';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import { useViewStore } from '../stores/useViewStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorMenu = (): MenuEntry[] => {
  const view = useActiveDocument();
  const grid = useViewStore((state) => state.grid);
  const gridMajor = useViewStore((state) => state.gridMajor);
  const gridTile = useViewStore((state) => state.gridTile);
  const rulers = useViewStore((state) => state.rulers);
  const tiled = useViewStore((state) => state.tiled);
  const symmetryX = useToolStore((state) => state.symmetryX);
  const symmetryY = useToolStore((state) => state.symmetryY);
  const mode = useSpriteStore((state) => state.mode);
  const tileMode = useTilemapStore((state) => state.editMode);
  const collision = useTilemapStore((state) => state.showCollision);
  const terrainBrush = useTilemapStore((state) => state.terrainBrush);
  const hasDocument = view !== null;
  const canUndo = view?.canUndo ?? false;
  const canRedo = view?.canRedo ?? false;
  return useMemo(
    () => editorMenu({ hasDocument, canUndo, canRedo, grid, gridMajor, gridTile, rulers, tiled, symmetryX, symmetryY, mode, tileMode, collision, terrainBrush }),
    [hasDocument, canUndo, canRedo, grid, gridMajor, gridTile, rulers, tiled, symmetryX, symmetryY, mode, tileMode, collision, terrainBrush],
  );
};

export { useEditorMenu };
