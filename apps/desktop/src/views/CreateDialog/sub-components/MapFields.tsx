/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, Select, Span } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { MAX_MAP_SIDE, NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const MapFields = ({ form, errors, update }: CreateFieldsProps) => {
  const tilesets = useActiveDocument()?.state.artwork.tilesets ?? [];
  return (
    <Flex direction="column" gap="sm">
      <Field label={NEW_TEXT.tilesetPick} error={errors.sheet ?? undefined}>
        <Select
          options={tilesets.map((tileset) => ({ value: tileset.id, label: tileset.name }))}
          value={form.tilesetId}
          onChange={(tilesetId) => update({ tilesetId })}
          aria-label={NEW_TEXT.tilesetPick}
        />
      </Field>
      <Field label={NEW_TEXT.mapGrid}>
        <Flex gap="sm" align="center" wrap>
          <NumberInput size="sm" sizeToContent min={1} max={MAX_MAP_SIDE} step={1} value={form.columns} aria-label={NEW_TEXT.columns} onChange={(columns) => update({ columns })} />
          <Span>{NEW_TEXT.columns}</Span>
          <Span>x</Span>
          <NumberInput size="sm" sizeToContent min={1} max={MAX_MAP_SIDE} step={1} value={form.rows} aria-label={NEW_TEXT.rows} onChange={(rows) => update({ rows })} />
          <Span>{NEW_TEXT.rows}</Span>
        </Flex>
      </Field>
    </Flex>
  );
};

export { MapFields };
