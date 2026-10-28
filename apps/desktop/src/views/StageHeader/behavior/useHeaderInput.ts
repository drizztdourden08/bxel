/* @layer renderer-app @kind hook */
import { tileUseCounts } from '@bxel/document';
import { useMemo } from 'react';
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { gridsHidden } from '../../../canvas-look/grids-hidden';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useMapContext } from '../../../hooks/useMapContext';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { useSurface } from '../../../hooks/useSurface';
import { managerSheet } from '../../../sheet-manager/manager-sheet';
import { readAnimationHeader } from '../../../stage-header/read-animation-header';
import { readMapHeader } from '../../../stage-header/read-map-header';
import { readSpriteHeader } from '../../../stage-header/read-sprite-header';
import type { HeaderInput } from '../../../stage-header/stage-header.type';
import { useManagerStore } from '../../../stores/useManagerStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import { useViewStore } from '../../../stores/useViewStore';
import { MAP_TOOL_OPTIONS } from '../../OptionsToolbar/OptionsToolbar.constants';

const useHeaderInput = (): HeaderInput => {
  const surface = useSurface();
  const view = useActiveDocument();
  const target = useEditorTarget();
  const focus = useAnimationFocus();
  const scene = useSpriteScene();
  const sprites = useSpriteStore();
  const tiles = useTilemapStore();
  const kinds = useToolStore((state) => MAP_TOOL_OPTIONS[state.tool]);
  const sheetId = useManagerStore((state) => state.sheetId);
  const map = useMapContext();
  const flags = {
    pixel: useViewStore((state) => state.grid),
    major: useViewStore((state) => state.gridMajor),
    tile: useViewStore((state) => state.gridTile),
  };
  const look = useAssetLook(useCanvasLook());
  const zoom = useViewFeedStore((state) => state.view?.zoom ?? 0);
  const artwork = view?.state.artwork ?? null;
  const selected = scene?.scene.selected.length ?? 0;
  const hiddenGrids = gridsHidden(look, flags, zoom, surface);
  return useMemo(() => {
    const sheet = artwork && surface === 'sheet' ? managerSheet(artwork, sheetId, sprites.activeId) : null;
    const uses = map?.tileset && tiles.editKey !== null ? (tileUseCounts(map.artwork, map.tileset.id).get(tiles.editKey) ?? 0) : 0;
    return {
      surface,
      assetName: sheet?.name ?? artwork?.name ?? '',
      readOnly: view?.state.readOnly ?? false,
      hiddenGrids,
      sprite: target ? readSpriteHeader(target, { ...sprites, selected }) : null,
      animation: focus ? readAnimationHeader(focus) : null,
      sheetSelected: selected,
      tile: surface === 'tile' ? { key: tiles.editKey, uses } : null,
      map: surface === 'map'
        ? readMapHeader(map, { flags: tiles.flags, selection: tiles.selection, showTurn: kinds.includes('mapFlags'), showSelection: kinds.includes('mapSelection') })
        : null,
    };
    // The grouped stores are read whole, so these keys name what the memo follows.
  }, [surface, view, target, focus, artwork, selected, sprites, tiles, kinds, sheetId, map, hiddenGrids]);
};

export { useHeaderInput };
