/* @layer renderer-app @kind component */
import { listPresets } from '@bxel/presets';
import { Icon, ListItemList, ListItemRow, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { rulesLine } from '../../platform-preset/rules-line';
import { PRESET_BROWSER_TEXT } from './PresetBrowser.constants';

const PresetBrowser = () => (
  <Stack gap="lg">
    <Text tone="muted">{PRESET_BROWSER_TEXT.intro}</Text>
    {listPresets().map((family) => (
      <SettingsSection key={family.family} id={family.family} title={family.family}>
        <ListItemList label={family.family}>
          {family.presets.map((preset) => (
            <ListItemRow
              key={preset.id}
              icon={<Icon name="gamepad-2" />}
              name={preset.name}
              meta={`${rulesLine(preset, false)} ${PRESET_BROWSER_TEXT.canvas(preset.sizes.canvasDefault[0], preset.sizes.canvasDefault[1])}`}
            />
          ))}
        </ListItemList>
      </SettingsSection>
    ))}
  </Stack>
);

export { PresetBrowser };
