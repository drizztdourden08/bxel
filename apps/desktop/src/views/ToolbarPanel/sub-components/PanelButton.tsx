/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import type { IconName, ToolbarIcon } from '@drizztdourden08/tessera';
import type { PanelButtonProps } from '../ToolbarPanel.type';
import { PanelTip } from './PanelTip';

const isName = (icon: ToolbarIcon): icon is IconName => typeof icon === 'string';

const PanelButton = ({ icon, label, tip, active, disabled, onPress }: PanelButtonProps) => (
  <PanelTip {...tip}>
    <Button
      variant="tertiary"
      size="sm"
      fullWidth
      icon={isName(icon) ? <Icon name={icon} /> : icon}
      active={active}
      aria-pressed={active}
      disabled={disabled}
      onClick={onPress}
    >
      {label}
    </Button>
  </PanelTip>
);

export { PanelButton };
