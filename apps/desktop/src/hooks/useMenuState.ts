/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CONFIG_ENTRY_TEXT } from '../config-entry/config-entry.constants';
import type { EditorMenuState } from '../menu/editor-menu.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import { useViewStore } from '../stores/useViewStore';
import { useActiveAsset } from './useActiveAsset';
import { useActiveDocument } from './useActiveDocument';
import { useSurface } from './useSurface';

const useMenuState = (): EditorMenuState => {
  const view = useActiveDocument();
  const kind = useActiveAsset()?.tab?.key.kind ?? null;
  const surface = useSurface();
  const shown = useViewStore(useShallow((s) => ({ grid: s.grid, gridMajor: s.gridMajor, gridTile: s.gridTile, rulers: s.rulers, tiled: s.tiled })));
  const mirror = useToolStore(useShallow((s) => ({ symmetryX: s.symmetryX, symmetryY: s.symmetryY })));
  const isolated = useSpriteStore((s) => s.isolated);
  const map = useTilemapStore(useShallow((s) => ({ tileMode: s.editMode, collision: s.showCollision, terrainBrush: s.terrainBrush })));
  const settings = kind === null ? CONFIG_ENTRY_TEXT.noAsset : CONFIG_ENTRY_TEXT.title(kind);
  const [hasDocument, canUndo, canRedo] = [view !== null, view?.canUndo ?? false, view?.canRedo ?? false];
  return useMemo(
    () => ({ hasDocument, canUndo, canRedo, ...shown, ...mirror, ...map, surface, kind, isolated, settings }),
    [hasDocument, canUndo, canRedo, shown, mirror, map, surface, kind, isolated, settings],
  );
};

export { useMenuState };
