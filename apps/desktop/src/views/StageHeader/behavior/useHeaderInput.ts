/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { useSurface } from '../../../hooks/useSurface';
import { readAnimationHeader } from '../../../stage-header/read-animation-header';
import { readSpriteHeader } from '../../../stage-header/read-sprite-header';
import type { HeaderInput } from '../../../stage-header/stage-header.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useAssetName } from './useAssetName';
import { useHiddenGrids } from './useHiddenGrids';
import { useMapHeader } from './useMapHeader';
import { useTileHeader } from './useTileHeader';

const useHeaderInput = (): HeaderInput => {
  const surface = useSurface();
  const readOnly = useActiveDocument()?.state.readOnly ?? false;
  const target = useEditorTarget();
  const focus = useAnimationFocus();
  const sprites = useSpriteStore();
  const selected = useSpriteScene()?.scene.selected.length ?? 0;
  const assetName = useAssetName();
  const hiddenGrids = useHiddenGrids();
  const tile = useTileHeader();
  const map = useMapHeader();
  return useMemo(
    () => ({
      surface,
      assetName,
      readOnly,
      hiddenGrids,
      sprite: target ? readSpriteHeader(target, { ...sprites, selected }) : null,
      animation: focus ? readAnimationHeader(focus) : null,
      sheetSelected: selected,
      tile,
      map,
    }),
    [surface, assetName, readOnly, hiddenGrids, target, sprites, selected, focus, tile, map],
  );
};

export { useHeaderInput };
