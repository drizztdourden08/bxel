/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';

const selectedKeys = (): readonly number[] => useTilemapStore.getState().stamp.keys.filter((key) => key !== 0);

export { selectedKeys };
