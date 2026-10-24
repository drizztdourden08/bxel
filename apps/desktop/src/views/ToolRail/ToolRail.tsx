/* @layer renderer-app @kind component */
import { ButtonGroup, Flex } from '@drizztdourden08/tessera';
import { TOOL_GROUPS, TOOLS } from '../../editor/tools.constants';
import { useToolStore } from '../../stores/useToolStore';
import { TOOL_RAIL_TEXT } from './ToolRail.constants';
import { ToolSlot } from './sub-components/ToolSlot';
import './ToolRail.css';

const ToolRail = () => {
  const tool = useToolStore((state) => state.tool);
  const selectTool = useToolStore((state) => state.selectTool);
  return (
    <Flex direction="column" gap="sm" className="tool-rail" role="group" aria-label={TOOL_RAIL_TEXT.region}>
      {TOOL_GROUPS.map((group) => (
        <ButtonGroup key={group} orientation="vertical" aria-label={TOOL_RAIL_TEXT.groups[group]}>
          {TOOLS.filter((def) => def.group === group).map((def) => (
            <ToolSlot key={def.id} def={def} active={tool === def.id} onSelect={() => selectTool(def.id)} />
          ))}
        </ButtonGroup>
      ))}
    </Flex>
  );
};

export { ToolRail };
