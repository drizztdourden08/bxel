/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { tileSizeOf } from '../ruler/tile-size-of';
import { useMapContext } from '../hooks/useMapContext';
import { useSpriteScene } from '../hooks/useSpriteScene';
import { useCanvasSurface } from '../canvas-surface/useCanvasSurface';
import { managerSheet } from '../sheet-manager/manager-sheet';
import type { AppSettings } from '../settings.type';
import { useManagerStore } from '../stores/useManagerStore';
import { gridDefaults } from './grid-defaults';
import type { AssetGridDefaults } from './asset-view.type';

const useGridDefaults = (): AssetGridDefaults => {
  const surface = useCanvasSurface();
  const tileset = useMapContext()?.tileset ?? null;
  const scene = useSpriteScene();
  const sheetId = useManagerStore((state) => state.sheetId);
  const { settings } = useSettings<AppSettings>();
  const artwork = scene?.artwork ?? null;
  const activeId = scene?.scene.active?.id ?? null;
  const setting = tileSizeOf(settings.gridTileSize);
  return useMemo(() => {
    const sheet = surface === 'sheet' && artwork ? managerSheet(artwork, sheetId, activeId) : null;
    return gridDefaults({ surface, tileset, sheet, setting });
  }, [surface, tileset, artwork, sheetId, activeId, setting]);
};

export { useGridDefaults };
