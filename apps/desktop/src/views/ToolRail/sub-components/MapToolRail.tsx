/* @layer renderer-app @kind component */
import { ButtonGroup, Flex } from '@drizztdourden08/tessera';
import { TOOL_GROUPS } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOLS } from '../../../tilemap/map-tools.constants';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import { MapToolButton } from './MapToolButton';

const MapToolRail = () => {
  const tool = useToolStore((state) => state.tool);
  const selectTool = useToolStore((state) => state.selectTool);
  return (
    <Flex direction="column" gap="sm" className="tool-rail" role="group" aria-label={TOOL_RAIL_TEXT.region}>
      {TOOL_GROUPS.map((group) => (
        <ButtonGroup key={group} orientation="vertical" aria-label={TOOL_RAIL_TEXT.groups[group]}>
          {MAP_TOOLS.filter((def) => def.group === group).map((def) => (
            <MapToolButton key={def.id} def={def} active={tool === def.id} onSelect={() => selectTool(def.id)} />
          ))}
        </ButtonGroup>
      ))}
    </Flex>
  );
};

export { MapToolRail };
