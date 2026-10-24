/* @layer renderer-app @kind component */
import type { TilesetId } from '@bxel/document';
import { Field, Flex, Select, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { MAP_SIZE_RANGE, TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';
import type { MapFieldsProps } from '../TilemapDialog.type';
import { OrientationFields } from './OrientationFields';
import { SizePair } from './SizePair';

const MapFields = ({ model }: MapFieldsProps) => {
  const { form, update } = model;
  const tilesets = useActiveDocument()?.state.artwork.tilesets ?? [];
  return (
    <Stack gap="md">
      <Field label={TILEMAP_DIALOG_TEXT.name}>
        <TextInput value={form.name} onChange={(event) => update({ name: event.target.value })} />
      </Field>
      <Field label={TILEMAP_DIALOG_TEXT.tileset}>
        <Select
          aria-label={TILEMAP_DIALOG_TEXT.tileset}
          value={form.tilesetId ?? ''}
          options={tilesets.map((each) => ({ value: each.id, label: `${each.name} (${each.tileWidth} x ${each.tileHeight})` }))}
          onChange={(value) => update({ tilesetId: value as TilesetId })}
        />
      </Field>
      <Field label={TILEMAP_DIALOG_TEXT.mapSize}>
        <Flex gap="sm" align="center" wrap>
          <SizePair
            range={MAP_SIZE_RANGE}
            first={{ label: TILEMAP_DIALOG_TEXT.columns, value: form.columns, onChange: (columns) => update({ columns }) }}
            second={{ label: TILEMAP_DIALOG_TEXT.rows, value: form.rows, onChange: (rows) => update({ rows }) }}
          />
        </Flex>
      </Field>
      <OrientationFields model={model} />
      <Text variant="caption" tone="muted">
        {TILEMAP_DIALOG_TEXT.mapNote}
      </Text>
    </Stack>
  );
};

export { MapFields };
