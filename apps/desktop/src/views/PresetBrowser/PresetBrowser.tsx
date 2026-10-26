/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { PRESET_SECTIONS } from '../../platform-preset/preset-sections.constants';
import { SettingsSplit } from '../SettingsSplit';
import { PRESET_BROWSER_TEXT } from './PresetBrowser.constants';
import { PresetPreviewPane } from './sub-components/PresetPreviewPane';

const PresetBrowser = () => (
  <Stack gap="md">
    <Text tone="muted">{PRESET_BROWSER_TEXT.intro}</Text>
    <SettingsSplit sections={PRESET_SECTIONS} preview={<PresetPreviewPane />} />
  </Stack>
);

export { PresetBrowser };
