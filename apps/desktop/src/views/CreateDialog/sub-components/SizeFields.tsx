/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, SegmentedControl, Span } from '@drizztdourden08/tessera';
import { NEW_TEXT, SIZE_PRESETS } from '../../../new-sprite/new-sprite.constants';
import { SIZE_RANGE } from '../../../sprite-name/sprite-name.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const presetValue = (width: number, height: number): string => (width === height && SIZE_PRESETS.includes(width) ? String(width) : '');

const SizeFields = ({ form, errors, update }: CreateFieldsProps) => (
  <Field label={NEW_TEXT.size} error={errors.size ?? undefined}>
    <Flex gap="sm" align="center" wrap>
      <NumberInput
        size="sm"
        sizeToContent
        min={SIZE_RANGE.min}
        max={SIZE_RANGE.max}
        step={1}
        value={form.width}
        aria-label={NEW_TEXT.width}
        onChange={(width) => update({ width })}
      />
      <Span>x</Span>
      <NumberInput
        size="sm"
        sizeToContent
        min={SIZE_RANGE.min}
        max={SIZE_RANGE.max}
        step={1}
        value={form.height}
        aria-label={NEW_TEXT.height}
        onChange={(height) => update({ height })}
      />
      <SegmentedControl
        size="sm"
        aria-label={NEW_TEXT.size}
        value={presetValue(form.width, form.height)}
        options={SIZE_PRESETS.map((each) => ({ value: String(each), label: String(each) }))}
        onChange={(value) => update({ width: Number(value), height: Number(value) })}
      />
    </Flex>
  </Field>
);

export { SizeFields };
