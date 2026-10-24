/* @layer renderer-app @kind component */
import { Field, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { spriteOptions } from '../behavior/sprite-options';
import { EXPORT_DIALOG_TEXT, LAYER_OPTIONS } from '../ExportDialog.constants';
import type { TargetFieldsProps } from '../ExportDialog.type';
import { FrameFields } from './FrameFields';

const TargetFields = ({ settings, change, spriteCount, selectedCount, sheetLabel, tags }: TargetFieldsProps) => (
  <Stack gap="md">
    <Field label={EXPORT_DIALOG_TEXT.sprites}>
      <SegmentedControl
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.sprites}
        value={settings.sprites}
        options={spriteOptions(spriteCount, selectedCount, sheetLabel)}
        onChange={(sprites) => change({ sprites })}
      />
    </Field>
    <Field label={EXPORT_DIALOG_TEXT.layers}>
      <SegmentedControl
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.layers}
        value={settings.layers}
        options={LAYER_OPTIONS}
        onChange={(layers) => change({ layers })}
      />
    </Field>
    {settings.kind !== 'sprite' && <FrameFields settings={settings} change={change} tags={tags} />}
  </Stack>
);

export { TargetFields };
