/* @layer renderer-app @kind logic */
import type { TileStamp } from '../../../stores/tilemap-store.type';

const toggleScatter = (stamp: TileStamp, key: number): TileStamp => {
  const held = stamp.keys.filter((each) => each !== 0);
  const keys = held.includes(key) ? held.filter((each) => each !== key) : [...held, key];
  if (keys.length === 0) return { columns: 1, rows: 1, keys: [0] };
  if (keys.length === 1) return { columns: 1, rows: 1, keys };
  return { columns: keys.length, rows: 1, keys, scatter: true };
};

export { toggleScatter };
