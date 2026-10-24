/* @layer renderer-app @kind component */
import { RadioGroup, Select, Stack } from '@drizztdourden08/tessera';
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { PIVOT_PRESETS } from '../../../../../sheet-manager/manager.constants';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { PIVOT_KINDS } from '../ManagerDialogs.constants';
import type { PivotFieldsProps } from '../ManagerDialogs.type';
import { NumberPair } from './NumberPair';

const PivotFields = ({ form, update }: PivotFieldsProps) => (
  <Stack gap="sm">
    <RadioGroup value={form.kind} options={[...PIVOT_KINDS]} onChange={(kind) => update({ kind })} />
    {form.kind === 'preset' && (
      <Select
        size="sm"
        aria-label={DIALOG_TEXT.pivotPreset}
        options={PIVOT_PRESETS.map((preset) => ({ value: preset.id, label: preset.label }))}
        value={form.preset}
        onChange={(preset) => update({ preset })}
      />
    )}
    {form.kind === 'exact' && (
      <NumberPair
        first={{ label: DIALOG_TEXT.pivotX, value: form.x, onChange: (x) => update({ x }) }}
        second={{ label: DIALOG_TEXT.pivotY, value: form.y, onChange: (y) => update({ y }) }}
        min={0}
        max={MAX_SPRITE_SIZE}
        step={0.5}
      />
    )}
  </Stack>
);

export { PivotFields };
