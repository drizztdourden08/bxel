/* @layer renderer-app @kind component */
import { Checkbox, Stack, Text } from '@drizztdourden08/tessera';
import { presetFields } from '../../../editor/presets/preset-fields';
import { memberById } from '../../../editor/tool-catalogue/member-by-id';
import { readOption } from '../../../editor/tool-options/read-option';
import { valueWords } from '../../../editor/tool-options/value-words';
import { PRESET_DIALOG_TEXT } from '../PresetDialog.constants';
import type { PresetForm } from '../behavior/usePresetForm.type';

const PresetFields = ({ member, form }: { member: string; form: PresetForm }) => {
  const tool = memberById(member)?.member.tool;
  const specs = tool === undefined ? [] : presetFields(tool);
  return (
    <Stack gap="xs" role="group" aria-label={PRESET_DIALOG_TEXT.fields}>
      <Text variant="label">{PRESET_DIALOG_TEXT.fields}</Text>
      <Text variant="caption" tone="muted">
        {PRESET_DIALOG_TEXT.fieldsHint}
      </Text>
      {specs.map((spec) => (
        <Checkbox
          key={spec.id}
          checked={form.ticked.includes(spec.id)}
          onChange={() => form.toggle(spec.id)}
          label={`${spec.label}: ${valueWords(spec, readOption(spec))}`}
        />
      ))}
    </Stack>
  );
};

export { PresetFields };
