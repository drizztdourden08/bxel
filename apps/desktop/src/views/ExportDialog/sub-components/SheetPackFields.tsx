/* @layer renderer-app @kind component */
import { Checkbox, Field, Flex, NumberInput, Stack } from '@drizztdourden08/tessera';
import { EXPORT_RANGES } from '../../../export/export.constants';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { FieldsProps } from '../ExportDialog.type';

const SheetPackFields = ({ settings, change }: FieldsProps) => (
  <Stack gap="md">
    <Flex gap="md" align="center" wrap>
      <Checkbox size="sm" label={EXPORT_DIALOG_TEXT.trim} checked={settings.trim} onChange={(trim) => change({ trim })} />
      <Checkbox size="sm" label={EXPORT_DIALOG_TEXT.powerOfTwo} checked={settings.powerOfTwo} onChange={(powerOfTwo) => change({ powerOfTwo })} />
      <Checkbox
        size="sm"
        label={EXPORT_DIALOG_TEXT.mergeFrames}
        title={EXPORT_DIALOG_TEXT.mergeFramesHint}
        disabled={settings.flavour === 'tiled'}
        checked={settings.mergeFrames && settings.flavour !== 'tiled'}
        onChange={(mergeFrames) => change({ mergeFrames })}
      />
      <Checkbox
        size="sm"
        label={EXPORT_DIALOG_TEXT.rotate}
        disabled={settings.layout !== 'packed'}
        title={EXPORT_DIALOG_TEXT.rotateHint}
        checked={settings.rotate && settings.layout === 'packed'}
        onChange={(rotate) => change({ rotate })}
      />
    </Flex>
    <Field label={EXPORT_DIALOG_TEXT.pageSide} hint={EXPORT_DIALOG_TEXT.pageSideHint}>
      <NumberInput
        size="sm"
        {...EXPORT_RANGES.pageSide}
        step={64}
        value={settings.pageSide}
        aria-label={EXPORT_DIALOG_TEXT.pageSide}
        onChange={(pageSide) => change({ pageSide })}
      />
    </Field>
  </Stack>
);

export { SheetPackFields };
