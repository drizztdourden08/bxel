/* @layer renderer-app @kind component */
import { Divider } from '@drizztdourden08/tessera';
import type { PanelItemProps } from '../ToolbarPanel.type';
import { PanelButton } from './PanelButton';
import { PanelGroup } from './PanelGroup';
import { PanelNumber } from './PanelNumber';

const PanelItem = ({ item }: PanelItemProps) => {
  if (item.kind === 'separator') return <Divider />;
  if (item.kind === 'group') return <PanelGroup item={item} />;
  if (item.kind === 'number') return <PanelNumber item={item} />;
  const tip = { name: item.label, description: item.description, shortcut: item.shortcut };
  if (item.kind === 'toggle') {
    return <PanelButton icon={item.icon} label={item.label} tip={tip} active={item.pressed} disabled={item.disabled} onPress={() => item.onChange(!item.pressed)} />;
  }
  return <PanelButton icon={item.icon} label={item.label} tip={tip} active={undefined} disabled={item.disabled} onPress={item.onSelect} />;
};

export { PanelItem };
