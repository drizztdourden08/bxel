/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { systemClipHeld } from './system-clip-held';

const refreshSystemClip = async (): Promise<void> => {
  useSelectionStore.getState().setSystemClip(await systemClipHeld());
};

export { refreshSystemClip };
