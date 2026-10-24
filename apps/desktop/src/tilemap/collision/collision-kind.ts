/* @layer renderer-app @kind logic */
import type { TileCollision } from '@bxel/document';
import type { CollisionKind } from './collision.type';

const collisionKind = (collision: TileCollision | undefined): CollisionKind => collision?.kind ?? 'none';

export { collisionKind };
