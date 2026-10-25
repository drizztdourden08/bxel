/* @layer renderer-app @kind component */
import { CodeBlock, CopyButton, Flex, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const ClientConfigBlock = ({ model }: PanelPartProps) => (
  <SettingsSection id="client-config" title={PANEL_TEXT.configTitle} description={PANEL_TEXT.configHint}>
    {model.config === null ? (
      <Text tone="muted">{PANEL_TEXT.configLoading}</Text>
    ) : (
      <Stack gap="sm">
        <Flex justify="end">
          <CopyButton text={model.config} label={PANEL_TEXT.copy} showLabel />
        </Flex>
        <CodeBlock code={model.config} language="json" wrap />
      </Stack>
    )}
  </SettingsSection>
);

export { ClientConfigBlock };
