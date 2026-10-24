/* @layer renderer-app @kind component */
import { IconButton } from '@drizztdourden08/tessera';
import { MAP_TOOL_ICONS } from '../../../tilemap/map-tools.constants';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { toolHint } from '../behavior/tool-hint';
import type { ToolButtonProps } from '../ToolRail.type';

const MapToolButton = ({ def, active, onSelect }: ToolButtonProps) => (
  <ActionHint hint={toolHint(def)}>
    <IconButton label={def.label} active={active} onClick={onSelect}>
      <PixelIcon name={MAP_TOOL_ICONS[def.id]} />
    </IconButton>
  </ActionHint>
);

export { MapToolButton };
