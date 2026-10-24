/* @layer renderer-app @kind component */
import { Field, Flex, SegmentedControl, Select } from '@drizztdourden08/tessera';
import { backgroundChoices } from '../../../new-sprite/background-choices';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { BACKGROUND_OPTIONS, TRANSPARENT_OFF_REASON } from '../CreateDialog.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const BackgroundField = ({ form, errors, update }: CreateFieldsProps) => {
  const options = BACKGROUND_OPTIONS.map((option) =>
    option.value === 'transparent' && !form.transparent ? { ...option, disabled: TRANSPARENT_OFF_REASON } : option,
  );
  const colors = backgroundChoices(form).map((choice) => ({ value: String(choice.slot), label: NEW_TEXT.swatch(choice.slot, choice.name) }));
  return (
    <Field label={NEW_TEXT.background} error={errors.background ?? undefined}>
      <Flex gap="sm" align="center" wrap>
        <SegmentedControl
          size="sm"
          aria-label={NEW_TEXT.background}
          value={form.background}
          options={options}
          onChange={(background) => update({ background })}
        />
        {form.background === 'opaque' && (
          <Select options={colors} value={String(form.backgroundSlot)} onChange={(slot) => update({ backgroundSlot: Number(slot) })} />
        )}
      </Flex>
    </Field>
  );
};

export { BackgroundField };
