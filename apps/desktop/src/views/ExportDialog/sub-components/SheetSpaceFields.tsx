/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput } from '@drizztdourden08/tessera';
import { EXPORT_RANGES } from '../../../export/export.constants';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const SheetSpaceFields = ({ settings, change }: FieldsProps) => (
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
    {settings.layout === 'packed' && (
      <Field label={EXPORT_DIALOG_TEXT.maxWidth}>
        <NumberInput
          size="sm"
          {...EXPORT_RANGES.maxWidth}
          step={64}
          value={settings.maxWidth}
          aria-label={EXPORT_DIALOG_TEXT.maxWidth}
          onChange={(maxWidth) => change({ maxWidth })}
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
    <Field label={EXPORT_DIALOG_TEXT.margin}>
      <NumberInput
        size="sm"
        {...EXPORT_RANGES.margin}
        step={1}
        value={settings.margin}
        aria-label={EXPORT_DIALOG_TEXT.margin}
        onChange={(margin) => change({ margin })}
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
);

export { SheetSpaceFields };
