/* @layer renderer-app @kind component */
import { Callout, Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { LEVEL_OPTIONS, MODE_OPTIONS, PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const LevelPicker = ({ model }: PanelPartProps) => (
  <Stack gap="sm">
    <Field label={PANEL_TEXT.levelLabel}>
      <Select options={LEVEL_OPTIONS} value={model.level} onChange={model.setLevel} />
    </Field>
    {model.level === 'allow_all' && (
      <Stack gap="sm">
        <Callout tone="warning">{PANEL_TEXT.warning}</Callout>
        <Field label={PANEL_TEXT.allowAllModeLabel}>
          <Select options={MODE_OPTIONS} value={model.allowAllMode} onChange={model.setAllowAllMode} />
        </Field>
      </Stack>
    )}
    <Text variant="caption" tone="muted">
      {PANEL_TEXT.nameNote}
    </Text>
  </Stack>
);

export { LevelPicker };
