/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import { STAMP_SLOT_TEXT } from './tilemap.constants';

const recallStamp = (slot: number): boolean => {
  const kept = useTilemapStore.getState().stampSlots[slot];
  if (!kept) {
    useNoticeStore.getState().post(STAMP_SLOT_TEXT.empty(slot + 1));
    return false;
  }
  useTilemapStore.getState().setStamp(kept);
  useToolStore.getState().setTool('pencil');
  announce(STAMP_SLOT_TEXT.recalled(slot + 1));
  return true;
};

export { recallStamp };
