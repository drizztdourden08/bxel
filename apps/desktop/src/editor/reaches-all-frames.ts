/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../stores/useLayerViewStore';
import type { EditorTarget } from './editor.type';

const reachesAllFrames = (target: EditorTarget): boolean => target.animation !== undefined && useLayerViewStore.getState().scope === 'all';

export { reachesAllFrames };
