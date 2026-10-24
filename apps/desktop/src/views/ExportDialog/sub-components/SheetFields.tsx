/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { EXPORT_RANGES } from '../../../export/export.constants';
import { EXPORT_DIALOG_TEXT, FLAVOUR_OPTIONS, LAYOUT_OPTIONS } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';
import { SheetPackFields } from './SheetPackFields';

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
    <Flex gap="md" wrap>
      {settings.layout === 'grid' && (
        <Field label={EXPORT_DIALOG_TEXT.columns}>
          <NumberInput
            size="sm"
            {...EXPORT_RANGES.columns}
            step={1}
            value={settings.columns}
            aria-label={EXPORT_DIALOG_TEXT.columns}
            onChange={(columns) => change({ columns })}
          />
        </Field>
      )}
      <Field label={EXPORT_DIALOG_TEXT.padding}>
        <NumberInput
          size="sm"
          {...EXPORT_RANGES.padding}
          step={1}
          value={settings.padding}
          aria-label={EXPORT_DIALOG_TEXT.padding}
          onChange={(padding) => change({ padding })}
        />
      </Field>
      <Field label={EXPORT_DIALOG_TEXT.extrusion}>
        <NumberInput
          size="sm"
          {...EXPORT_RANGES.extrusion}
          step={1}
          value={settings.extrusion}
          aria-label={EXPORT_DIALOG_TEXT.extrusion}
          onChange={(extrusion) => change({ extrusion })}
        />
      </Field>
    </Flex>
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
