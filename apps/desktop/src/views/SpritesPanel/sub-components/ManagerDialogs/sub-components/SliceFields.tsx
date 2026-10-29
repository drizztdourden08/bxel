/* @layer renderer-app @kind component */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { Checkbox, RadioGroup, Stack, Text } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { EXISTING_RULES, SLICE_KINDS } from '../ManagerDialogs.constants';
import type { SliceFieldsProps } from '../../../../../sheet-manager/dialog-form.type';
import { NumberPair } from './NumberPair';

const SliceFields = ({ spec, update, clashes }: SliceFieldsProps) => (
  <Stack gap="sm">
    <RadioGroup value={spec.by} options={[...SLICE_KINDS]} onChange={(by) => update({ by })} />
    {spec.by === 'count' && (
      <NumberPair
        first={{ label: COMPOSE_TEXT.columns, value: spec.columns, onChange: (columns) => update({ columns }) }}
        second={{ label: COMPOSE_TEXT.rows, value: spec.rows, onChange: (rows) => update({ rows }) }}
        min={1}
        max={MAX_SPRITE_SIZE}
        step={1}
      />
    )}
    {spec.by === 'size' && (
      <NumberPair
        first={{ label: COMPOSE_TEXT.cellWidth, value: spec.cellWidth, onChange: (cellWidth) => update({ cellWidth }) }}
        second={{ label: COMPOSE_TEXT.cellHeight, value: spec.cellHeight, onChange: (cellHeight) => update({ cellHeight }) }}
        min={1}
        max={MAX_SPRITE_SIZE}
        step={1}
      />
    )}
    {spec.by === 'islands' && (
      <NumberPair
        first={{ label: COMPOSE_TEXT.minSize, value: spec.minSize, onChange: (minSize) => update({ minSize }) }}
        second={{ label: COMPOSE_TEXT.mergeGap, value: spec.merge, onChange: (merge) => update({ merge }) }}
        min={0}
        max={MAX_SPRITE_SIZE}
        step={1}
      />
    )}
    {spec.by !== 'islands' && <Checkbox label={COMPOSE_TEXT.skipEmpty} checked={spec.skipEmpty} onChange={(skipEmpty) => update({ skipEmpty })} />}
    {clashes > 0 && (
      <Stack gap="xs">
        <Text tone="dim">{COMPOSE_TEXT.clashCount(clashes)}</Text>
        <RadioGroup value={spec.existing} options={[...EXISTING_RULES]} onChange={(existing) => update({ existing })} />
      </Stack>
    )}
  </Stack>
);

export { SliceFields };
