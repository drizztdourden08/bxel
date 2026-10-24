/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import type { JsonValue } from './sheet-metadata.type';

const boxJson = (box: Box): JsonValue => ({ x: box.x, y: box.y, w: box.width, h: box.height });

export { boxJson };
