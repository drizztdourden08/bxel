/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import { EDITOR_LOOK } from './thumb.constants';

const editorZoom = (size: Size): number => Math.max(2, Math.floor(EDITOR_LOOK.box / Math.max(size.width, size.height)));

export { editorZoom };
