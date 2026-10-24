/* @layer renderer-app @kind component */
import { Field, NumberInput, Paragraph } from '@drizztdourden08/tessera';
import { EXPORT_RANGES } from '../../../export/export.constants';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const ScaleField = ({ settings, change }: FieldsProps) => (
  <Field label={EXPORT_DIALOG_TEXT.scale}>
    <NumberInput
      size="sm"
      {...EXPORT_RANGES.scale}
      step={1}
      value={settings.scale}
      aria-label={EXPORT_DIALOG_TEXT.scale}
      onChange={(scale) => change({ scale })}
    />
    <Paragraph tone="dim">{EXPORT_DIALOG_TEXT.scaleNote}</Paragraph>
  </Field>
);

export { ScaleField };
