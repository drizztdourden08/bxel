/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useTilemapStore } from '../stores/useTilemapStore';
import { STAMP_SLOT_TEXT } from './tilemap.constants';

const storeStamp = (slot: number): void => {
  useTilemapStore.getState().storeStamp(slot);
  announce(STAMP_SLOT_TEXT.stored(slot + 1));
};

export { storeStamp };
