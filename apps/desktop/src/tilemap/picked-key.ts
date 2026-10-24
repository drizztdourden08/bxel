/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';

const pickedKey = (): number | null => useTilemapStore.getState().stamp.keys.find((key) => key !== 0) ?? null;

export { pickedKey };
