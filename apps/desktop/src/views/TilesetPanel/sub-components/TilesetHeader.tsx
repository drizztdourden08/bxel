/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { pickedLine } from '../behavior/picked-line';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const TilesetHeader = ({ model }: TilesetModelProps) => {
  const { tileset } = model;
  const picked = pickedLine(model);
  return (
    <Stack gap="2xs">
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.summary(tileset.name, tileset.tileWidth, tileset.tileHeight, tileset.tiles.length)}
      </Text>
      {model.selected.length > 0 && (
        <Text variant="caption" tone="muted" role="status">
          {picked}
        </Text>
      )}
    </Stack>
  );
};

export { TilesetHeader };
