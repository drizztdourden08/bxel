/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { PIXELS_OF } from './sample-pixels.constants';

const samplePixels = (target: EditorTarget): Uint8Array => PIXELS_OF[useSelectionStore.getState().sample](target);

export { samplePixels };
