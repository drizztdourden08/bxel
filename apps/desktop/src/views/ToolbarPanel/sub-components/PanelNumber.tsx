/* @layer renderer-app @kind component */
import { NumberInput, Stack, Text } from '@drizztdourden08/tessera';
import type { PanelNumberProps } from '../ToolbarPanel.type';
import { PanelTip } from './PanelTip';

const PanelNumber = ({ item }: PanelNumberProps) => (
  <Stack gap="xs">
    <Text variant="caption" tone="muted">{item.label}</Text>
    <PanelTip name={item.label} description={item.description} shortcut={item.shortcut}>
      <NumberInput size="sm" value={item.value} min={item.min} max={item.max} step={item.step} disabled={item.disabled} aria-label={item.label} onChange={item.onChange} />
    </PanelTip>
  </Stack>
);

export { PanelNumber };
