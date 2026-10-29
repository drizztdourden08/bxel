/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { EditorTarget } from '../editor.type';

const mergedPixels = (target: EditorTarget): Uint8Array => flattenFrame(target.sprite, target.frameId);

export { mergedPixels };
