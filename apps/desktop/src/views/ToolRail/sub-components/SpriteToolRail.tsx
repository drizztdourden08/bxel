/* @layer renderer-app @kind component */
import { Toolbar } from '@drizztdourden08/tessera';
import { useRailItems } from '../behavior/useRailItems';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';

const SpriteToolRail = () => {
  const items = useRailItems();
  return <Toolbar label={TOOL_RAIL_TEXT.region} orientation="vertical" items={items} className="tool-rail" />;
};

export { SpriteToolRail };
