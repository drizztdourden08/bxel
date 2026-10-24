/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput } from '@drizztdourden08/tessera';
import { COLLISION_RECT_FIELDS, COLLISION_TEXT } from '../../../tilemap/collision/collision.constants';
import { setCollision } from '../../../tilemap/set-collision';
import type { CollisionProps } from '../TilesetPanel.type';

const CollisionRectFields = ({ tileset, tile }: CollisionProps) => {
  const { collision } = tile;
  if (collision?.kind !== 'rect') return null;
  const limit = { x: tileset.tileWidth, y: tileset.tileHeight, width: tileset.tileWidth, height: tileset.tileHeight };
  return (
    <Flex gap="xs" wrap>
      {COLLISION_RECT_FIELDS.map((field) => (
        <Field key={field.id} label={field.label}>
          <NumberInput
            size="sm"
            sizeToContent
            min={field.id === 'width' || field.id === 'height' ? 1 : 0}
            max={limit[field.id]}
            step={1}
            value={collision[field.id]}
            aria-label={`${COLLISION_TEXT.rectLabel} ${field.label}`}
            onChange={(value) => setCollision(tile.key, { ...collision, [field.id]: value })}
          />
        </Field>
      ))}
    </Flex>
  );
};

export { CollisionRectFields };
