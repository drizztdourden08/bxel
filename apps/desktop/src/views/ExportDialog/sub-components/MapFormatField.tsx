/* @layer renderer-app @kind component */
import { Field, SegmentedControl } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT, MAP_FORMAT_OPTIONS } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const MapFormatField = ({ settings, change }: FieldsProps) => (
  <Field label={EXPORT_DIALOG_TEXT.mapFormat}>
    <SegmentedControl
      size="sm"
      aria-label={EXPORT_DIALOG_TEXT.mapFormat}
      value={settings.mapFormat}
      options={MAP_FORMAT_OPTIONS}
      onChange={(mapFormat) => change({ mapFormat })}
    />
  </Field>
);

export { MapFormatField };
