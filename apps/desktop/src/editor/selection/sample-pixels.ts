/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { celPixels } from './cel-pixels';

const samplePixels = (target: EditorTarget): Uint8Array =>
  useSelectionStore.getState().sample === 'visible' ? flattenFrame(target.sprite, target.frameId) : celPixels(target);

export { samplePixels };
