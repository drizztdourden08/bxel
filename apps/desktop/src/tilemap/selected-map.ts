/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { readiedMap } from './readied-map';
import { TILEMAP_TEXT } from './tilemap.constants';
import type { SelectedMap } from './tilemap.type';

const selectedMap = (): SelectedMap | null => {
  const target = readiedMap();
  if (!target) return null;
  const { selection } = useTilemapStore.getState();
  if (!selection) useNoticeStore.getState().post(TILEMAP_TEXT.needSelection);
  return selection ? { target, selection } : null;
};

export { selectedMap };
