/* @layer renderer-app @kind component */
import { Field, SegmentedControl } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { KIND_OPTIONS } from '../CreateDialog.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const KindField = ({ form, update }: CreateFieldsProps) => (
  <Field label={NEW_TEXT.kind}>
    <SegmentedControl aria-label={NEW_TEXT.kind} value={form.kind} options={KIND_OPTIONS} onChange={(kind) => update({ kind })} />
  </Field>
);

export { KindField };
