/* @layer renderer-app @kind component */
import { Tooltip, TooltipContent } from '@drizztdourden08/tessera';
import type { PanelTipProps } from '../ToolbarPanel.type';

const PanelTip = ({ name, description, shortcut, children }: PanelTipProps) => (
  <Tooltip content={<TooltipContent name={name} description={description} shortcut={shortcut} />} placement="left">
    {children}
  </Tooltip>
);

export { PanelTip };
