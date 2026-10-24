/* @layer renderer-app @kind component */
import { Field, NumberInput, Paragraph, Stack } from '@drizztdourden08/tessera';
import { ROTATE_RANGE } from '../../../editor/pending/pending.constants';
import { clampField } from '../../../editor/transform/clamp-field';
import { TRANSFORM_DIALOG_TEXT } from '../TransformDialog.constants';
import type { RotateFieldsProps } from '../TransformDialog.type';
import { BoundsField } from './BoundsField';

const RotateFields = ({ spec, onChange }: RotateFieldsProps) => (
  <Stack gap="md">
    <Field label={TRANSFORM_DIALOG_TEXT.angle}>
      <NumberInput
        min={ROTATE_RANGE.min}
        max={ROTATE_RANGE.max}
        step={1}
        value={spec.angle}
        aria-label={TRANSFORM_DIALOG_TEXT.angle}
        onChange={(angle) => onChange({ ...spec, angle: clampField(angle, ROTATE_RANGE) })}
      />
    </Field>
    <BoundsField bounds={spec.bounds} onChange={(bounds) => onChange({ ...spec, bounds })} />
    <Paragraph tone="dim">{TRANSFORM_DIALOG_TEXT.note}</Paragraph>
  </Stack>
);

export { RotateFields };
