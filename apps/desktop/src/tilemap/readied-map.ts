/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentMap } from './current-map';
import { TILEMAP_TEXT } from './tilemap.constants';
import type { MapTarget } from './tilemap.type';

const readiedMap = (): MapTarget | null => {
  const target = currentMap();
  if (!target) useNoticeStore.getState().post(TILEMAP_TEXT.noTarget);
  return target;
};

export { readiedMap };
