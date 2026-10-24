/* @layer renderer-app @kind component */
import type { ToolButtonProps } from '../ToolRail.type';
import { SelectFlyout } from './SelectFlyout';
import { ShapeFlyout } from './ShapeFlyout';
import { ToolButton } from './ToolButton';

const ToolSlot = (props: ToolButtonProps) => {
  if (props.def.id === 'shape') return <ShapeFlyout {...props} />;
  if (props.def.id === 'select') return <SelectFlyout {...props} />;
  return <ToolButton {...props} />;
};

export { ToolSlot };
