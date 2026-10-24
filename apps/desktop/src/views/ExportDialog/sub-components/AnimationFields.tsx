/* @layer renderer-app @kind component */
import { Field, SegmentedControl } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT, FORMAT_OPTIONS } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const AnimationFields = ({ settings, change }: FieldsProps) => (
  <Field label={EXPORT_DIALOG_TEXT.format}>
    <SegmentedControl
      size="sm"
      aria-label={EXPORT_DIALOG_TEXT.format}
      value={settings.animation}
      options={FORMAT_OPTIONS}
      onChange={(animation) => change({ animation })}
    />
  </Field>
);

export { AnimationFields };
