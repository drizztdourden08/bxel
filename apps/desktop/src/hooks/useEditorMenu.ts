/* @layer renderer-app @kind hook */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { editorMenu } from '../menu/editor-menu';
import { useToolStore } from '../stores/useToolStore';
import { useViewStore } from '../stores/useViewStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorMenu = (): MenuEntry[] => {
  const view = useActiveDocument();
  const grid = useViewStore((state) => state.grid);
  const tiled = useViewStore((state) => state.tiled);
  const symmetryX = useToolStore((state) => state.symmetryX);
  const symmetryY = useToolStore((state) => state.symmetryY);
  const hasDocument = view !== null;
  const canUndo = view?.canUndo ?? false;
  const canRedo = view?.canRedo ?? false;
  return useMemo(
    () => editorMenu({ hasDocument, canUndo, canRedo, grid, tiled, symmetryX, symmetryY }),
    [hasDocument, canUndo, canRedo, grid, tiled, symmetryX, symmetryY],
  );
};

export { useEditorMenu };
