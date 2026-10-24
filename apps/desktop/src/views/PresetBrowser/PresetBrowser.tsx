/* @layer renderer-app @kind component */
import { listPresets } from '@bxel/presets';
import { Card, Stack, Text } from '@drizztdourden08/tessera';
import { rulesLine } from '../../platform-preset/rules-line';
import { PRESET_BROWSER_TEXT } from './PresetBrowser.constants';

const PresetBrowser = () => (
  <Stack gap="md">
    <Text>{PRESET_BROWSER_TEXT.intro}</Text>
    {listPresets().map((family) => (
      <Card key={family.family}>
        <Stack gap="xs">
          <Text variant="label">{family.family}</Text>
          {family.presets.map((preset) => (
            <Stack key={preset.id} gap="2xs">
              <Text>{preset.name}</Text>
              <Text variant="caption" tone="muted">
                {rulesLine(preset)}
              </Text>
              <Text variant="caption" tone="muted">
                {PRESET_BROWSER_TEXT.canvas(preset.sizes.canvasDefault[0], preset.sizes.canvasDefault[1])}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Card>
    ))}
  </Stack>
);

export { PresetBrowser };
