/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const NameField = ({ form, errors, update }: CreateFieldsProps) => (
  <Field label={NEW_TEXT.name} error={errors.name ?? undefined}>
    <TextInput value={form.name} onChange={(event) => update({ name: event.target.value })} />
  </Field>
);

export { NameField };
