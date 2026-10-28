/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { frameSpread } from '../../../editor/frame-spread';
import { layerItems } from '../../../editor/layer-items';
import { spriteLayerActions } from '../../../editor/layer-actions';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { LAYER_STACK_TEXT, NO_MAPS } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';
import { ownerOf } from './owner-of';

const noop = (): void => undefined;

const useSpriteLayerModel = (): LayerStackModel => {
  const target = useEditorTarget();
  const scope = useLayerViewStore((state) => state.scope);
  const tiles = useSpriteStore((state) => state.mode === 'tilemap');
  const editing = useTilemapStore((state) => state.editMode === 'edit');
  const tileEdit = tiles && editing;
  return useMemo(() => {
    const empty = tileEdit ? LAYER_STACK_TEXT.noTile : LAYER_STACK_TEXT.noSprite;
    if (!target) {
      return { kind: 'sprite', owner: '', ownerMeta: null, empty, rows: [], activeId: null, locks: [], maps: NO_MAPS, mapId: null, onMap: noop, frames: 0, actions: spriteLayerActions };
    }
    return {
      kind: 'sprite',
      owner: ownerOf(target),
      ownerMeta: null,
      empty: null,
      rows: layerItems(target, frameSpread(target, scope)),
      activeId: target.layerId,
      locks: ['none', 'transparency', 'pixels'],
      maps: NO_MAPS,
      mapId: null,
      onMap: noop,
      frames: target.animation ? target.animation.animation.frames.length : 0,
      actions: spriteLayerActions,
    };
  }, [target, scope, tileEdit]);
};

export { useSpriteLayerModel };
