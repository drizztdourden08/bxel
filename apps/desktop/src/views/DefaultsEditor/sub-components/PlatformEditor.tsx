/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { NO_PLATFORM, PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { PLATFORM_GROUPS } from '../DefaultsEditor.constants';

const PlatformEditor = ({ value, onChange }: { value: unknown; onChange: (value: unknown) => void }) => (
  <Select
    searchable
    groups={PLATFORM_GROUPS}
    value={typeof value === 'string' ? value : NO_PLATFORM}
    onChange={(next) => onChange(next === NO_PLATFORM ? null : next)}
    aria-label={PLATFORM_TEXT.label}
  />
);

export { PlatformEditor };
