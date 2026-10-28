/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const pickedLine = (model: TilesetModelProps['model']): string => {
  if (model.selected.length > 1) return TILESET_TEXT.pickedMany(model.selected.length);
  const cell = model.pickedKey === null ? undefined : model.byKey.get(model.pickedKey);
  if (!cell) return '';
  const type = cell.tile.type ? `, ${cell.tile.type}` : '';
  return `${TILESET_TEXT.pickedOne(cell.tile.key, cell.uses)}${type}`;
};

const TilesetHeader = ({ model }: TilesetModelProps) => {
  const { tileset } = model;
  const picked = pickedLine(model);
  return (
    <Stack gap="2xs">
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.summary(tileset.name, tileset.tileWidth, tileset.tileHeight, tileset.tiles.length)}
      </Text>
      {picked !== '' && (
        <Text variant="caption" tone="muted" role="status">
          {picked}
        </Text>
      )}
    </Stack>
  );
};

export { TilesetHeader };
