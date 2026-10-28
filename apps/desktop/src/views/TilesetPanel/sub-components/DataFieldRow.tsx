/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, Stack, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setFields } from '../../../tilemap/set-fields';
import { setTileData } from '../../../tilemap/set-tile-data';
import { mixedOf } from '../behavior/mixed-of';
import { selectedTiles } from '../behavior/selected-tiles';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { DataFieldRowProps } from '../TilesetPanel.type';
import { FieldValueEditor } from './FieldValueEditor';

const DataFieldRow = ({ model, field }: DataFieldRowProps) => {
  const paint = useTilesetViewStore((state) => state.dataPaint);
  const setPaint = useTilesetViewStore((state) => state.setDataPaint);
  const tiles = selectedTiles(model);
  const keys = tiles.map((tile) => tile.key);
  const current = mixedOf(tiles, (tile) => tile.data?.[field.name]);
  const painting = paint?.field === field.name;
  const shown = painting ? paint.value : current.value;
  const change = (value: string | number | boolean): void => {
    if (painting) setPaint({ field: field.name, value });
    else setTileData(keys, { data: { [field.name]: value } });
  };
  return (
    <Stack gap="2xs" className="tileset-panel__field" role="group" aria-label={field.name}>
      <Flex gap="xs" align="center" justify="between">
        <Text variant="label">{field.name}</Text>
        <Flex gap="2xs" align="center">
          <IconButton
            label={painting ? TILESET_TEXT.stopPaint(field.name) : TILESET_TEXT.paint(field.name)}
            size="sm"
            active={painting}
            onClick={() => setPaint(painting ? null : { field: field.name, value: current.value ?? field.default })}
          >
            <Icon name="pixel-map-paint" size={16} />
          </IconButton>
          <IconButton
            label={TILESET_TEXT.clearValue(field.name)}
            size="sm"
            disabled={keys.length === 0 || current.value === undefined}
            onClick={() => setTileData(keys, { data: { [field.name]: null } })}
          >
            <Icon name="x" size={16} />
          </IconButton>
          <IconButton label={TILESET_TEXT.removeField(field.name)} size="sm" onClick={() => setFields({ fields: (model.tileset.fields ?? []).filter((each) => each.name !== field.name) })}>
            <Icon name="trash-2" size={16} />
          </IconButton>
        </Flex>
      </Flex>
      <FieldValueEditor field={field} value={shown} mixed={!painting && current.mixed} onChange={change} />
      {painting ? (
        <Text variant="caption" tone="muted">
          {TILESET_TEXT.painting}
        </Text>
      ) : null}
    </Stack>
  );
};

export { DataFieldRow };
