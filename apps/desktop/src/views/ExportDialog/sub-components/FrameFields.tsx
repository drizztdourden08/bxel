/* @layer renderer-app @kind component */
import { Field, Select, SegmentedControl } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT, FRAME_OPTIONS } from '../ExportDialog.constants';
import type { FrameFieldsProps } from '../ExportDialog.type';

const FrameFields = ({ settings, change, tags }: FrameFieldsProps) => (
  <Field label={EXPORT_DIALOG_TEXT.frames}>
    <SegmentedControl
      size="sm"
      aria-label={EXPORT_DIALOG_TEXT.frames}
      value={settings.frames}
      options={FRAME_OPTIONS.map((option) => ({
        ...option,
        disabled: option.value === 'tag' && tags.length === 0 ? EXPORT_DIALOG_TEXT.noTags : false,
      }))}
      onChange={(frames) => change({ frames })}
    />
    {settings.frames === 'tag' && (
      <Select
        size="sm"
        aria-label={EXPORT_DIALOG_TEXT.tag}
        value={settings.tag}
        options={tags.map((tag) => ({ value: tag, label: tag }))}
        onChange={(tag) => change({ tag })}
      />
    )}
  </Field>
);

export { FrameFields };
