/* @layer renderer-app @kind component */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { Checkbox, RadioGroup, Stack } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { SLICE_KINDS } from '../ManagerDialogs.constants';
import type { SliceFieldsProps } from '../ComposeDialogs.type';
import { NumberPair } from './NumberPair';

const SliceFields = ({ spec, update }: SliceFieldsProps) => (
  <Stack gap="sm">
    <RadioGroup value={spec.by} options={[...SLICE_KINDS]} onChange={(by) => update({ by })} />
    {spec.by === 'count' ? (
      <NumberPair
        first={{ label: COMPOSE_TEXT.columns, value: spec.columns, onChange: (columns) => update({ columns }) }}
        second={{ label: COMPOSE_TEXT.rows, value: spec.rows, onChange: (rows) => update({ rows }) }}
        min={1}
        max={MAX_SPRITE_SIZE}
        step={1}
      />
    ) : (
      <NumberPair
        first={{ label: COMPOSE_TEXT.cellWidth, value: spec.cellWidth, onChange: (cellWidth) => update({ cellWidth }) }}
        second={{ label: COMPOSE_TEXT.cellHeight, value: spec.cellHeight, onChange: (cellHeight) => update({ cellHeight }) }}
        min={1}
        max={MAX_SPRITE_SIZE}
        step={1}
      />
    )}
    <Checkbox label={COMPOSE_TEXT.skipEmpty} checked={spec.skipEmpty} onChange={(skipEmpty) => update({ skipEmpty })} />
  </Stack>
);

export { SliceFields };
