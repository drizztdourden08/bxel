/* @layer renderer-app @kind component */
import { ActionHint } from '../../ActionHint';
import { toolHint } from '../behavior/tool-hint';
import type { ToolButtonProps } from '../ToolRail.type';
import { ToolIcon } from './ToolIcon';

const ToolButton = (props: ToolButtonProps) => (
  <ActionHint hint={toolHint(props.def)}>
    <ToolIcon {...props} />
  </ActionHint>
);

export { ToolButton };
