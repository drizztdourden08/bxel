/* @layer renderer-app @kind component */
import { listPresets } from '@bxel/presets';
import { Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { platformGroups } from '../../platform-preset/platform-groups';
import { presetById } from '../../platform-preset/preset-by-id';
import { PreviewSplit } from '../PreviewSplit';
import { PRESET_BROWSER_TEXT } from './PresetBrowser.constants';
import { PresetFacts } from './sub-components/PresetFacts';
import { PresetPreview } from './sub-components/PresetPreview';

const PresetBrowser = () => {
  const groups = useMemo(() => platformGroups().slice(1), []);
  const [picked, setPicked] = useState(() => listPresets()[0]?.presets[0]?.id ?? '');
  const preset = presetById(picked);
  return (
    <Stack gap="md">
      <Text tone="muted">{PRESET_BROWSER_TEXT.intro}</Text>
      <Field label={PRESET_BROWSER_TEXT.pickLabel} hint={PRESET_BROWSER_TEXT.pickHint}>
        <Select value={picked} onChange={setPicked} groups={groups} searchable />
      </Field>
      {preset !== null && <PreviewSplit main={<PresetFacts preset={preset} />} preview={<PresetPreview preset={preset} />} />}
    </Stack>
  );
};

export { PresetBrowser };
