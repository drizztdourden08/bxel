/* @layer renderer-app @kind logic */
import type { TerrainVariant } from '@bxel/document';
import type { SlotAction } from './edit-slot.type';
import { isTurned } from './is-turned';

const slotChange = (action: SlotAction, key: number): ((list: readonly TerrainVariant[]) => readonly TerrainVariant[]) => {
  if (action === 'clear') return () => [];
  if (action === 'use') return () => [{ key, weight: 1 }];
  return (list) => (list.some((each) => each.key === key && !isTurned(each)) ? list : [...list, { key, weight: 1 }]);
};

export { slotChange };
