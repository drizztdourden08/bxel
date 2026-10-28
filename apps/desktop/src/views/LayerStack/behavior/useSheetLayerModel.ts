/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { Sprite } from '@bxel/document';
import { flagFields } from '../../../editor/flag-fields';
import { lockFields } from '../../../editor/lock-fields';
import { LAYER_LABEL } from '../../../editor/layer-text.constants';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { listSprites } from '../../../sheet/list-sprites';
import { sheetLayerRows } from '../../../sheet/sheet-layer-rows';
import { tryUpdateSheetLayers } from '../../../sheet/try-update-sheet-layers';
import { updateSheetLayers } from '../../../sheet/update-sheet-layers';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { LAYER_STACK_TEXT, NO_MAPS } from '../LayerStack.constants';
import type { LayerActions } from '../../../editor/layer-actions.type';
import type { LayerRowModel, LayerStackModel } from '../LayerStack.type';

const noop = (): void => undefined;

const actionsFor = (sprites: readonly Sprite[]): LayerActions => ({
  activate: noop,
  setFlag: (names, flag, value) => updateSheetLayers(sprites, names, flagFields(flag, value), LAYER_LABEL[flag]),
  setLock: (names, kind) => updateSheetLayers(sprites, names, lockFields(kind), LAYER_LABEL.locked),
  setColour: (names, colour) => updateSheetLayers(sprites, names, { colour }, LAYER_LABEL.colour),
  solo: noop,
  others: noop,
  rename: (name, next) => tryUpdateSheetLayers(sprites, [name], { name: next }, LAYER_LABEL.rename),
  move: noop,
  add: noop,
  duplicate: noop,
  merge: noop,
  flatten: noop,
  remove: noop,
});

const rowOf = (row: ReturnType<typeof sheetLayerRows>[number]): LayerRowModel => ({
  id: row.name,
  name: row.name,
  visible: row.visible,
  mixedVisible: row.mixedVisible,
  lock: row.lock,
  mixedLock: row.mixedLock,
  colour: row.colour,
  note: row.carriers < row.total ? LAYER_STACK_TEXT.inSprites(row.carriers, row.total) : null,
  thumb: null,
});

const useSheetLayerModel = (): LayerStackModel => {
  const view = useActiveDocument();
  const picked = useSpriteStore((state) => state.selected);
  const anchor = useLayerViewStore((state) => state.anchor);
  const artwork = view?.state.artwork;
  return useMemo(() => {
    const all = artwork ? listSprites(artwork) : [];
    const chosen = all.filter((sprite) => picked.includes(sprite.id));
    const sprites = chosen.length > 0 ? chosen : all;
    const owner = chosen.length > 0 ? LAYER_STACK_TEXT.sheetPicked(chosen.length) : LAYER_STACK_TEXT.sheetAll(all.length);
    return {
      kind: 'sheet',
      owner,
      ownerMeta: null,
      empty: sprites.length === 0 ? LAYER_STACK_TEXT.noSprite : null,
      rows: sheetLayerRows(sprites).map(rowOf),
      activeId: anchor,
      locks: ['none', 'transparency', 'pixels'],
      maps: NO_MAPS,
      mapId: null,
      onMap: noop,
      frames: 0,
      actions: actionsFor(sprites),
    };
  }, [artwork, picked, anchor]);
};

export { useSheetLayerModel };
