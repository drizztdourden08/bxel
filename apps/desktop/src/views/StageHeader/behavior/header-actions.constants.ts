/* @layer renderer-app @kind constants */
import { toggleLayerFlag } from '../../../editor/toggle-layer-flag';
import { backToSheet } from '../../../sheet/back-to-sheet';
import { toggleBroadcast } from '../../../sheet/toggle-broadcast';
import type { HeaderActions } from '../../../stage-header/stage-header.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { flagMapLayer } from '../../../tilemap/flag-map-layer';
import { openSprite } from '../../../timeline/open-sprite';
import { ownFrame } from '../../../timeline/own-frame';
import { TIMELINE_LABEL } from '../../../timeline/timeline.constants';

const HEADER_ACTIONS: HeaderActions = {
  back: backToSheet,
  toggleBroadcast,
  openSprite: () => void openSprite(),
  copyFrame: () => void ownFrame(TIMELINE_LABEL.copy),
  placeTiles: () => useTilemapStore.getState().placeTiles(),
  pickLayer: (layerId) => useToolStore.getState().setLayer(layerId),
  toggleLayerFlag: (flag, layerId) => toggleLayerFlag(flag, layerId),
  flagMapLayer: (flag, layerId) => void flagMapLayer(layerId, flag, flag === 'visible'),
  setSpritesScope: (scope) => useSpriteStore.getState().setSpritesScope(scope),
  setLayerScope: (scope) => useSpriteStore.getState().setLayerScope(scope),
};

export { HEADER_ACTIONS };
