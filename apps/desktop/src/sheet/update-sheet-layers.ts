/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { LayerFields } from '../editor/layer-lock.type';
import { useNoticeStore } from '../stores/useNoticeStore';
import { tryUpdateSheetLayers } from './try-update-sheet-layers';

const updateSheetLayers = (sprites: readonly Sprite[], names: readonly string[], fields: LayerFields, label: string): void => {
  const refused = tryUpdateSheetLayers(sprites, names, fields, label);
  if (refused) useNoticeStore.getState().post(refused);
};

export { updateSheetLayers };
