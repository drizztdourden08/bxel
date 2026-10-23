/* @layer renderer-app @kind component */
import { ButtonGroup, IconButton, Text, Tooltip } from '@drizztdourden08/tessera';
import { TOOLS } from '../../editor/tools.constants';
import { useToolStore } from '../../stores/useToolStore';
import { TOOL_RAIL_TEXT } from './ToolRail.constants';
import './ToolRail.css';

const ToolRail = () => {
  const tool = useToolStore((state) => state.tool);
  const setTool = useToolStore((state) => state.setTool);
  return (
    <ButtonGroup orientation="vertical" aria-label={TOOL_RAIL_TEXT.region} className="tool-rail">
      {TOOLS.map((def) => {
        const name = TOOL_RAIL_TEXT.name(def.label, def.key);
        return (
          <Tooltip key={def.id} content={name} placement="bottom">
            <IconButton label={name} active={tool === def.id} onClick={() => setTool(def.id)}>
              <Text as="span" variant="label">{def.key.toUpperCase()}</Text>
            </IconButton>
          </Tooltip>
        );
      })}
    </ButtonGroup>
  );
};

export { ToolRail };
