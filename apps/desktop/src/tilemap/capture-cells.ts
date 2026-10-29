/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { blockStamp } from './block-stamp';
import { currentMap } from './current-map';

const captureCells = (rect: Rect, mask: Uint8Array | null = null): boolean => {
  const target = currentMap();
  if (!target) return false;
  const stamp = blockStamp(target, rect, mask);
  if (stamp.keys.every((key) => key === 0)) return false;
  const store = useTilemapStore.getState();
  store.setStamp(stamp);
  store.setFlags(NO_FLAGS);
  return true;
};

export { captureCells };
