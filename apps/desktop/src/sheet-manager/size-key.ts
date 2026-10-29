/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';

const sizeKey = (item: Size): string => `${item.width}x${item.height}`;

export { sizeKey };
