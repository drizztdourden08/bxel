/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import { COLLISION_VIEW } from './collision.constants';

const collisionScale = (tile: Size): number => Math.max(1, Math.floor(COLLISION_VIEW.box / Math.max(tile.width, tile.height)));

export { collisionScale };
