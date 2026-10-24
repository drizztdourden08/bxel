/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';

const useSelectionReset = (): void => {
  const tool = useToolStore((state) => state.tool);
  useEffect(() => {
    if (tool !== 'select') useTilemapStore.getState().setSelection(null);
  }, [tool]);
};

export { useSelectionReset };
