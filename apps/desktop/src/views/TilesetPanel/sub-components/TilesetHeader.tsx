/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';

const pickedLine = (model: TilesetHeaderProps['model']): string => {
  const cell = model.cells.find((each) => each.tile.key === model.pickedKey);
  if (model.stamp.keys.length > 1) return TILESET_TEXT.pickedStamp(model.stamp.columns, model.stamp.rows);
  return cell ? TILESET_TEXT.picked(cell.tile.key, cell.uses) : '';
};

const TilesetHeader = ({ model }: TilesetHeaderProps) => {
  const { tileset } = model;
  const picked = pickedLine(model);
  return (
    <Stack gap="2xs">
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.summary(tileset.name, tileset.tileWidth, tileset.tileHeight, tileset.tiles.length)}
      </Text>
      {picked !== '' && (
        <Text variant="caption" tone="muted">
          {picked}
        </Text>
      )}
    </Stack>
  );
};

export { TilesetHeader };
