/* @layer renderer-app @kind component */
import { PRESET_IDS, PRESETS } from '@bxel/mcp';
import { Select } from '@drizztdourden08/tessera';
import { GRANT_TEXT_UI } from '../ProgramGrant.constants';
import type { PresetChoice } from '../behavior/grant-rows.type';

const PRESET_CHOICES = [
  ...PRESET_IDS.map((id) => ({ value: id, label: PRESETS[id].label, description: PRESETS[id].description })),
  { value: 'custom', label: GRANT_TEXT_UI.customLabel, description: undefined, disabled: GRANT_TEXT_UI.customReason },
  { value: 'blocked', label: GRANT_TEXT_UI.blockedLabel, description: undefined },
];

const asChoice = (value: string): PresetChoice => PRESET_CHOICES.find((choice) => choice.value === value)?.value as PresetChoice;

type PresetSelectProps = {
  readonly name: string;
  readonly value: PresetChoice;
  readonly onChange: (choice: PresetChoice) => void;
};

const PresetSelect = ({ name, value, onChange }: PresetSelectProps) => (
  <Select
    options={PRESET_CHOICES.map(({ description, ...choice }) => (description === undefined ? choice : { ...choice, description }))}
    value={value}
    onChange={(next) => onChange(asChoice(next))}
    aria-label={name}
  />
);

export { PresetSelect };
