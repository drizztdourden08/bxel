/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { PanelItem } from './sub-components/PanelItem';
import type { ToolbarPanelProps } from './ToolbarPanel.type';

const ToolbarPanel = ({ label, items }: ToolbarPanelProps) => (
  <Stack gap="xs" role="group" aria-label={label}>
    {items.map((item) => <PanelItem key={item.id} item={item} />)}
  </Stack>
);

export { ToolbarPanel };
