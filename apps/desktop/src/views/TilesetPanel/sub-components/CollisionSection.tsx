/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { COLLISION_TEXT } from '../../../tilemap/collision/collision.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { CollisionCanvas } from './CollisionCanvas';
import { CollisionKindControl } from './CollisionKindControl';
import { CollisionPointsField } from './CollisionPointsField';
import { CollisionRectFields } from './CollisionRectFields';

const CollisionSection = ({ model }: TilesetHeaderProps) => {
  const cell = model.cells.find((each) => each.tile.key === model.pickedKey);
  if (!cell || model.stamp.keys.length > 1) return null;
  const props = { artwork: model.artwork, tileset: model.tileset, tile: cell.tile, sprite: cell.sprite };
  const shaped = cell.tile.collision?.kind === 'rect' || cell.tile.collision?.kind === 'polygon';
  return (
    <Stack gap="xs" role="group" aria-label={COLLISION_TEXT.title}>
      <Text variant="label">{COLLISION_TEXT.title}</Text>
      <CollisionKindControl {...props} />
      {shaped && <CollisionCanvas {...props} />}
      {shaped && (
        <Text variant="caption" tone="muted">
          {COLLISION_TEXT.help}
        </Text>
      )}
      <CollisionRectFields {...props} />
      <CollisionPointsField {...props} />
    </Stack>
  );
};

export { CollisionSection };
