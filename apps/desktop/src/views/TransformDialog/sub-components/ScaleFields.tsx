/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, Paragraph, Stack } from '@drizztdourden08/tessera';
import { SCALE_RANGE } from '../../../editor/pending/pending.constants';
import { clampField } from '../../../editor/transform/clamp-field';
import { TRANSFORM_DIALOG_TEXT } from '../TransformDialog.constants';
import type { ScaleFieldsProps } from '../TransformDialog.type';
import { BoundsField } from './BoundsField';

const ScaleFields = ({ spec, onChange }: ScaleFieldsProps) => (
  <Stack gap="md">
    <Flex gap="md">
      <Field label={TRANSFORM_DIALOG_TEXT.width}>
        <NumberInput
          min={SCALE_RANGE.min}
          max={SCALE_RANGE.max}
          step={1}
          value={spec.width}
          aria-label={TRANSFORM_DIALOG_TEXT.width}
          onChange={(width) => onChange({ ...spec, width: clampField(width, SCALE_RANGE) })}
        />
      </Field>
      <Field label={TRANSFORM_DIALOG_TEXT.height}>
        <NumberInput
          min={SCALE_RANGE.min}
          max={SCALE_RANGE.max}
          step={1}
          value={spec.height}
          aria-label={TRANSFORM_DIALOG_TEXT.height}
          onChange={(height) => onChange({ ...spec, height: clampField(height, SCALE_RANGE) })}
        />
      </Field>
    </Flex>
    <BoundsField bounds={spec.bounds} onChange={(bounds) => onChange({ ...spec, bounds })} />
    <Paragraph tone="dim">{TRANSFORM_DIALOG_TEXT.note}</Paragraph>
  </Stack>
);

export { ScaleFields };
