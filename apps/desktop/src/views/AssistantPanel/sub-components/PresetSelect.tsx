/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import type { PresetChoice } from '../behavior/grant-rows.type';
import { PRESET_CHOICES } from './PresetSelect.constants';
import type { PresetSelectProps } from './PresetSelect.type';

const asChoice = (value: string): PresetChoice => PRESET_CHOICES.find((choice) => choice.value === value)?.value as PresetChoice;

const PresetSelect = ({ name, value, onChange }: PresetSelectProps) => (
  <Select
    options={PRESET_CHOICES.map(({ description, ...choice }) => (description === undefined ? choice : { ...choice, description }))}
    value={value}
    onChange={(next) => onChange(asChoice(next))}
    aria-label={name}
  />
);

export { PresetSelect };
