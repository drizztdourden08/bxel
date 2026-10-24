/* @layer renderer-app @kind component */
import { Field, Flex, SegmentedControl, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { TILE_PRESETS, TILE_SIZE_RANGE, TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';
import type { TilesetFieldsProps } from '../TilemapDialog.type';
import { SizePair } from './SizePair';

const presetOf = (width: number, height: number): string => (width === height && TILE_PRESETS.includes(width) ? String(width) : '');

const TilesetFields = ({ model }: TilesetFieldsProps) => {
  const { form, update } = model;
  return (
    <Stack gap="md">
      <Field label={TILEMAP_DIALOG_TEXT.name}>
        <TextInput value={form.name} onChange={(event) => update({ name: event.target.value })} />
      </Field>
      <Field label={TILEMAP_DIALOG_TEXT.tileSize}>
        <Flex gap="sm" align="center" wrap>
          <SizePair
            range={TILE_SIZE_RANGE}
            first={{ label: TILEMAP_DIALOG_TEXT.width, value: form.width, onChange: (width) => update({ width }) }}
            second={{ label: TILEMAP_DIALOG_TEXT.height, value: form.height, onChange: (height) => update({ height }) }}
          />
          <SegmentedControl
            size="sm"
            aria-label={TILEMAP_DIALOG_TEXT.tileSize}
            value={presetOf(form.width, form.height)}
            options={TILE_PRESETS.map((each) => ({ value: String(each), label: String(each) }))}
            onChange={(value) => update({ width: Number(value), height: Number(value) })}
          />
        </Flex>
      </Field>
      <Text variant="caption" tone="muted">
        {TILEMAP_DIALOG_TEXT.tilesetNote}
      </Text>
    </Stack>
  );
};

export { TilesetFields };
