/* @layer renderer-app @kind component */
import { Field, NumberInput } from '@drizztdourden08/tessera';
import { MAX_NEW_BANKS, NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const BanksField = ({ form, errors, update }: CreateFieldsProps) => (
  <Field label={NEW_TEXT.banks} hint={NEW_TEXT.banksHint} error={errors.banks ?? undefined}>
    <NumberInput
      size="sm"
      sizeToContent
      min={1}
      max={MAX_NEW_BANKS}
      step={1}
      value={form.banks}
      aria-label={NEW_TEXT.banks}
      onChange={(banks) => update({ banks })}
    />
  </Field>
);

export { BanksField };
