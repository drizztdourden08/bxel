/* @layer renderer-app @kind logic */
import type { TilemapState } from '../stores/tilemap-store.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { pickTab } from './pick-tab';

const followMapPick = (state: TilemapState, previous: TilemapState): void => {
  if (state.mapId === null || state.mapId === previous.mapId || useSpriteStore.getState().mode !== 'tilemap') return;
  pickTab({ kind: 'tilemap', id: state.mapId });
};

export { followMapPick };
