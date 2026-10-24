/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import type { PanelGroupProps } from '../ToolbarPanel.type';
import { PanelButton } from './PanelButton';

const PanelGroup = ({ item }: PanelGroupProps) => (
  <Stack gap="xs" role="group" aria-label={item.label}>
    <Text variant="caption" tone="muted">{item.label}</Text>
    {item.choices.map((choice) => (
      <PanelButton
        key={choice.value}
        icon={choice.icon}
        label={choice.label}
        tip={{ name: choice.label, description: choice.description, shortcut: choice.shortcut }}
        active={item.value === choice.value}
        disabled={item.disabled === true || choice.disabled === true}
        onPress={() => item.onChange(choice.value)}
      />
    ))}
  </Stack>
);

export { PanelGroup };
