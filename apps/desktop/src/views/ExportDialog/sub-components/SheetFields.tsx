/* @layer renderer-app @kind component */
import { Field, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT, FLAVOUR_OPTIONS, LAYOUT_OPTIONS } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';
import { SheetPackFields } from './SheetPackFields';
import { SheetSpaceFields } from './SheetSpaceFields';

const SheetFields = ({ settings, change }: FieldsProps) => (
  <Stack gap="md">
    <Field label={EXPORT_DIALOG_TEXT.layout}>
      <SegmentedControl
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.layout}
        value={settings.layout}
        options={LAYOUT_OPTIONS}
        onChange={(layout) => change({ layout })}
      />
    </Field>
    <SheetSpaceFields settings={settings} change={change} />
    <SheetPackFields settings={settings} change={change} />
    <Field label={EXPORT_DIALOG_TEXT.flavour}>
      <SegmentedControl
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.flavour}
        value={settings.flavour}
        options={FLAVOUR_OPTIONS.map((option) => ({ ...option }))}
        onChange={(flavour) => change({ flavour })}
      />
    </Field>
  </Stack>
);

export { SheetFields };
