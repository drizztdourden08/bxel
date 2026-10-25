/* @layer renderer-app @kind component */
import { Callout, Field, Select, SettingsSection, Stack } from '@drizztdourden08/tessera';
import { LEVEL_OPTIONS, MODE_OPTIONS, PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const LevelPicker = ({ model }: PanelPartProps) => (
  <SettingsSection id="approving" title={PANEL_TEXT.levelLabel} description={PANEL_TEXT.nameNote}>
    <Stack gap="sm">
      <Select options={LEVEL_OPTIONS} value={model.level} onChange={model.setLevel} aria-label={PANEL_TEXT.levelLabel} />
      {model.level === 'allow_all' && (
        <Stack gap="sm">
          <Callout tone="warning">{PANEL_TEXT.warning}</Callout>
          <Field label={PANEL_TEXT.allowAllModeLabel}>
            <Select options={MODE_OPTIONS} value={model.allowAllMode} onChange={model.setAllowAllMode} />
          </Field>
        </Stack>
      )}
    </Stack>
  </SettingsSection>
);

export { LevelPicker };
