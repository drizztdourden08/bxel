/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CONFIG_ENTRY_TEXT } from '../config-entry/config-entry.constants';
import type { EditorMenuState } from '../menu/editor-menu.type';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import { useViewStore } from '../stores/useViewStore';
import { useBxelContext } from '../ui-context/useBxelContext';
import { useActiveAsset } from './useActiveAsset';

const useMenuState = (): EditorMenuState => {
  const context = useBxelContext((current) => current);
  const kind = useActiveAsset()?.tab?.key.kind ?? null;
  const shown = useViewStore(useShallow((s) => ({ grid: s.grid, gridMajor: s.gridMajor, gridTile: s.gridTile, guides: s.guides, rulers: s.rulers, tiled: s.tiled })));
  const mirror = useToolStore(useShallow((s) => ({ symmetryX: s.symmetryX, symmetryY: s.symmetryY })));
  const map = useTilemapStore(useShallow((s) => ({ collision: s.showCollision, terrainBrush: s.terrainBrush, animateTiles: s.animateTiles })));
  const settings = kind === null ? CONFIG_ENTRY_TEXT.noAsset : CONFIG_ENTRY_TEXT.title(kind);
  return useMemo(() => ({ context, ...shown, ...mirror, ...map, settings }), [context, shown, mirror, map, settings]);
};

export { useMenuState };
