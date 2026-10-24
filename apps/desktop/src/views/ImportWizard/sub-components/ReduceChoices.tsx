/* @layer renderer-app @kind component */
import { Field, RadioGroup } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import type { ReduceMode } from '../../../image-import/image-import.type';
import { reduceOptions } from '../../../image-import/reduce-options';
import type { WizardActionsProps } from '../ImportWizard.type';

const ReduceChoices = ({ wizard }: WizardActionsProps) => {
  const { form, context, update } = wizard;
  return (
    <Field label={IMPORT_TEXT.reduce}>
      <RadioGroup<ReduceMode | ''>
        label={IMPORT_TEXT.reduce}
        value={form.reduce ?? ''}
        options={reduceOptions(form, context)}
        onChange={(value) => update({ reduce: value === '' ? null : value })}
      />
    </Field>
  );
};

export { ReduceChoices };
