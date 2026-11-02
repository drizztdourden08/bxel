/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';

const stampMode = (scatter: boolean): boolean => {
  const { stamp, setStamp } = useTilemapStore.getState();
  const keys = stamp.keys.filter((key) => key !== 0);
  if (keys.length < 2) return false;
  if (scatter) setStamp({ columns: keys.length, rows: 1, keys, scatter: true });
  else if (stamp.scatter) setStamp({ columns: keys.length, rows: 1, keys });
  else setStamp({ columns: stamp.columns, rows: stamp.rows, keys: stamp.keys, ...(stamp.bits ? { bits: stamp.bits } : {}) });
  return true;
};

export { stampMode };
