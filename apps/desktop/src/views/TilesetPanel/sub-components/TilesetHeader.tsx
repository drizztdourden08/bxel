/* @layer renderer-app @kind component */
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { ActionHint } from '../../ActionHint';
import { NEW_TILEMAP_HINT, NEW_TILESET_HINT, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';

const pickedLine = (model: TilesetHeaderProps['model']): string => {
  const cell = model.cells.find((each) => each.tile.key === model.pickedKey);
  if (model.stamp.keys.length > 1) return TILESET_TEXT.pickedStamp(model.stamp.columns, model.stamp.rows);
  return cell ? TILESET_TEXT.picked(cell.tile.key, cell.uses) : '';
};

const TilesetHeader = ({ model }: TilesetHeaderProps) => {
  const show = useTilemapDialogStore((state) => state.show);
  const { tileset } = model;
  return (
    <Stack gap="xs">
      <Text variant="label">{TILESET_TEXT.title}</Text>
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.summary(tileset.name, tileset.tileWidth, tileset.tileHeight, tileset.tiles.length)}
      </Text>
      <Text variant="caption" tone="muted">
        {pickedLine(model)}
      </Text>
      <Flex gap="xs" wrap>
        <ActionHint hint={NEW_TILESET_HINT}>
          <Button size="sm" variant="tertiary" onClick={() => show('tileset')}>
            {TILESET_TEXT.newTileset}
          </Button>
        </ActionHint>
        <ActionHint hint={NEW_TILEMAP_HINT}>
          <Button size="sm" variant="tertiary" onClick={() => show('tilemap')}>
            {TILESET_TEXT.newTilemap}
          </Button>
        </ActionHint>
      </Flex>
    </Stack>
  );
};

export { TilesetHeader };
