/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, SegmentedControl, Select, Stack, Text } from '@drizztdourden08/tessera';
import { MAX_SPRITE_SIZE } from '@bxel/document';
import type { OrientRequest } from '@bxel/document';
import { ORIENTATION_CHOICES, ORIENTATION_TEXT, STAGGER_AXIS_CHOICES, STAGGER_INDEX_CHOICES } from '../../../tilemap/orientation.constants';
import type { MapFieldsProps } from '../TilemapDialog.type';

const OrientationFields = ({ model }: MapFieldsProps) => {
  const { form, update } = model;
  const shifts = form.orientation === 'staggered' || form.orientation === 'hexagonal';
  return (
    <Stack gap="sm">
      <Field label={ORIENTATION_TEXT.label}>
        <Select
          aria-label={ORIENTATION_TEXT.label}
          value={form.orientation}
          options={ORIENTATION_CHOICES.map((choice) => ({ value: choice.value, label: choice.label }))}
          onChange={(orientation) => update({ orientation: orientation as OrientRequest['kind'] })}
        />
      </Field>
      {shifts && (
        <Flex gap="sm" wrap>
          <SegmentedControl
            size="sm"
            aria-label={ORIENTATION_TEXT.axis}
            value={form.staggerAxis}
            options={[...STAGGER_AXIS_CHOICES]}
            onChange={(staggerAxis) => update({ staggerAxis })}
          />
          <SegmentedControl
            size="sm"
            aria-label={ORIENTATION_TEXT.index}
            value={form.staggerIndex}
            options={[...STAGGER_INDEX_CHOICES]}
            onChange={(staggerIndex) => update({ staggerIndex })}
          />
        </Flex>
      )}
      {form.orientation === 'hexagonal' && (
        <Field label={ORIENTATION_TEXT.side} hint={ORIENTATION_TEXT.sideHint}>
          <NumberInput size="sm" sizeToContent min={0} max={MAX_SPRITE_SIZE} step={1} value={form.hexSideLength} aria-label={ORIENTATION_TEXT.side} onChange={(hexSideLength) => update({ hexSideLength })} />
        </Field>
      )}
      {form.orientation !== 'orthogonal' && (
        <Text variant="caption" tone="muted">
          {ORIENTATION_TEXT.note}
        </Text>
      )}
    </Stack>
  );
};

export { OrientationFields };
