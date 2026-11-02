/* @layer renderer-app @kind constants */
import type { InkKind } from '../stores/drawing-store.type';

const INK_KINDS: readonly InkKind[] = ['normal', 'behind', 'lockAlpha', 'onlyColour', 'dither', 'shade', 'lighten', 'darken', 'pattern'];

export { INK_KINDS };
