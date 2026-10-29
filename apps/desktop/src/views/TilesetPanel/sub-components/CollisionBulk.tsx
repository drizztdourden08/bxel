/* @layer renderer-app @kind component */
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setShapes } from '../../../tilemap/set-shapes';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const CollisionBulk = ({ model }: TilesetModelProps) => {
  const keys = model.selected;
  const layer = useTilesetViewStore((state) => state.collisionLayer);
  const clipboard = useTilesetViewStore((state) => state.shapeClipboard);
  return (
    <Stack gap="xs">
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.bulkTitle(keys.length)}
      </Text>
      <Flex gap="xs" wrap>
        <Button size="sm" variant="secondary" onClick={() => setShapes(keys, [{ kind: 'full', layer }], 'layer')}>
          {TILESET_TEXT.bulkFull(keys.length)}
        </Button>
        <Button size="sm" variant="tertiary" onClick={() => setShapes(keys, [], 'set')}>
          {TILESET_TEXT.bulkClear(keys.length)}
        </Button>
        <Button size="sm" variant="tertiary" disabled={clipboard.length === 0} onClick={() => setShapes(keys, clipboard, 'set')}>
          {TILESET_TEXT.bulkPaste(keys.length)}
        </Button>
      </Flex>
    </Stack>
  );
};

export { CollisionBulk };
