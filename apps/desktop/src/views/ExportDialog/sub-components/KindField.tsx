/* @layer renderer-app @kind component */
import { Field, SegmentedControl } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT, KIND_OPTIONS } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const KindField = ({ settings, change }: FieldsProps) => (
  <Field label={EXPORT_DIALOG_TEXT.write}>
    <SegmentedControl
      size="sm"
      aria-label={EXPORT_DIALOG_TEXT.write}
      value={settings.kind}
      options={KIND_OPTIONS}
      onChange={(kind) => change({ kind })}
    />
  </Field>
);

export { KindField };
