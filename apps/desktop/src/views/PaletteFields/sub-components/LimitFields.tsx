/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, SegmentedControl } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { limitChoice } from '../../../palette-limit/limit-choice';
import { LIMIT_PRESETS, LIMIT_RANGE, LIMIT_TEXT } from '../../../palette-limit/palette-limit.constants';
import { LIMIT_OPTIONS } from '../PaletteFields.constants';
import type { LimitFieldsProps } from '../PaletteFields.type';

const LimitFields = ({ limit, error, onChange }: LimitFieldsProps) => {
  const [custom, setCustom] = useState(!LIMIT_PRESETS.includes(limit));
  return (
    <Field label={LIMIT_TEXT.label} error={error ?? undefined}>
      <Flex gap="sm" align="center" wrap>
        <SegmentedControl
          size="sm"
          aria-label={LIMIT_TEXT.label}
          value={custom ? LIMIT_TEXT.custom : limitChoice(limit)}
          options={LIMIT_OPTIONS}
          onChange={(value) => {
            setCustom(value === LIMIT_TEXT.custom);
            if (value !== LIMIT_TEXT.custom) onChange(Number(value));
          }}
        />
        <NumberInput
          size="sm"
          sizeToContent
          min={LIMIT_RANGE.min}
          max={LIMIT_RANGE.max}
          step={1}
          value={limit}
          aria-label={LIMIT_TEXT.custom}
          onChange={(value) => {
            setCustom(true);
            onChange(value);
          }}
        />
      </Flex>
    </Field>
  );
};

export { LimitFields };
