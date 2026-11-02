/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { allPixels } from './all-pixels';
import { celPixels } from './cel-pixels';
import { mergedPixels } from './merged-pixels';

const PIXELS_OF = { layer: celPixels, visible: mergedPixels, all: allPixels } as const;

const samplePixels = (target: EditorTarget): Uint8Array => PIXELS_OF[useSelectionStore.getState().sample](target);

export { samplePixels };
