/* @layer renderer-app @kind component */
import { SettingsPreviewLayout } from '@drizztdourden08/brock-react';
import { Select, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { presetById } from '../../platform-preset/preset-by-id';
import { FIRST_PRESET, PRESET_BROWSER_TEXT, PRESET_OPTIONS } from './PresetBrowser.constants';
import { PresetFacts } from './sub-components/PresetFacts';
import { PresetPreview } from './sub-components/PresetPreview';

const PresetBrowser = () => {
  const [picked, pick] = useState(FIRST_PRESET);
  const preset = presetById(picked);
  return (
    <SettingsPreviewLayout preview={preset && <PresetPreview preset={preset} />} label={PRESET_BROWSER_TEXT.previewLabel}>
      <Stack gap="md">
        <Text tone="muted">{PRESET_BROWSER_TEXT.intro}</Text>
        <Select searchable options={PRESET_OPTIONS} value={picked} onChange={pick} aria-label={PRESET_BROWSER_TEXT.pickLabel} />
        {preset && <PresetFacts preset={preset} />}
      </Stack>
    </SettingsPreviewLayout>
  );
};

export { PresetBrowser };
