/* @layer renderer-app @kind logic */
import type { TileCell } from '../TilesetPanel.type';

const slotKey = (slot: TileCell | null, index: number): string => (slot ? `tile-${slot.tile.key}` : `hole-${index}`);

export { slotKey };
