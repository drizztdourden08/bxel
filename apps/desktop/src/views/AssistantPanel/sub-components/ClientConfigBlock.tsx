/* @layer renderer-app @kind component */
import { CodeBlock, CopyButton, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const ClientConfigBlock = ({ model }: PanelPartProps) => (
  <Stack gap="sm">
    <Text variant="label">{PANEL_TEXT.configTitle}</Text>
    <Text variant="caption" tone="muted">
      {PANEL_TEXT.configHint}
    </Text>
    {model.config === null ? (
      <Text tone="muted">{PANEL_TEXT.configLoading}</Text>
    ) : (
      <Stack gap="sm">
        <CodeBlock code={model.config} language="json" wrap />
        <Flex>
          <CopyButton text={model.config} label={PANEL_TEXT.copy} showLabel />
        </Flex>
      </Stack>
    )}
  </Stack>
);

export { ClientConfigBlock };
