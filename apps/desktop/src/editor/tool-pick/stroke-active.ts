/* @layer renderer-app @kind logic */
import { useLivePaintStore } from '../../stores/useLivePaintStore';
import { gesture } from '../gesture-state';

const strokeActive = (): boolean => gesture.dragging || useLivePaintStore.getState().session !== null;

export { strokeActive };
