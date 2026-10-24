/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { COLLISION_KINDS, COLLISION_TEXT } from '../../../tilemap/collision/collision.constants';
import { collisionKind } from '../../../tilemap/collision/collision-kind';
import { defaultCollision } from '../../../tilemap/collision/default-collision';
import { setCollision } from '../../../tilemap/set-collision';
import type { CollisionProps } from '../TilesetPanel.type';

const CollisionKindControl = ({ tileset, tile }: CollisionProps) => (
  <SegmentedControl
    size="sm"
    aria-label={COLLISION_TEXT.kind}
    value={collisionKind(tile.collision)}
    options={[...COLLISION_KINDS]}
    onChange={(kind) => setCollision(tile.key, defaultCollision(kind, { width: tileset.tileWidth, height: tileset.tileHeight }))}
  />
);

export { CollisionKindControl };
