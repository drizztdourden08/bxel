/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { celPixels } from './cel-pixels';
import { mergedPixels } from './merged-pixels';

const samplePixels = (target: EditorTarget): Uint8Array =>
  useSelectionStore.getState().sample === 'visible' ? mergedPixels(target) : celPixels(target);

export { samplePixels };
