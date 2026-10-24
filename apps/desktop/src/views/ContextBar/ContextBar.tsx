/* @layer renderer-app @kind component */
import { Divider, Flex, ScrollArea } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useToolStore } from '../../stores/useToolStore';
import { ModeBar } from '../ModeBar';
import { CONTEXT_TEXT, MAP_TOOL_OPTIONS, TOOL_OPTIONS } from './ContextBar.constants';
import { ScopeChips } from './sub-components/ScopeChips';
import { TileBar } from './sub-components/TileBar';
import { ToolOptions } from './sub-components/ToolOptions';
import './ContextBar.css';

const ContextBar = () => {
  const tool = useToolStore((state) => state.tool);
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const placing = useMapPlacing();
  const options = placing ? MAP_TOOL_OPTIONS[tool] : TOOL_OPTIONS[tool];
  return (
    <ScrollArea axis="x" scrollbar="slim" role="group" aria-label={CONTEXT_TEXT.region} className="context-bar">
      <Flex gap="md" align="center" className="context-bar__row">
        <ModeBar />
        {tilemap ? <TileBar /> : <ScopeChips />}
        {options.length > 0 && <Divider orientation="vertical" />}
        <ToolOptions kinds={options} />
      </Flex>
    </ScrollArea>
  );
};

export { ContextBar };
