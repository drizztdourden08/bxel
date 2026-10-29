/* @layer renderer-app @kind logic */
import type { RefObject } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { MapLive } from '../TilemapCanvas.type';

const cancelMapGesture = (live: RefObject<MapLive>): void => {
  const store = useTilemapStore.getState();
  live.current.drag = null;
  if (store.paste) store.setPaste(null);
  else store.setSelection(null);
};

export { cancelMapGesture };
