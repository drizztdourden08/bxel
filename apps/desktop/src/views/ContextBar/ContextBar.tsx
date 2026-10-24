/* @layer renderer-app @kind component */
import { Divider, Flex } from '@drizztdourden08/tessera';
import { useToolStore } from '../../stores/useToolStore';
import { CONTEXT_TEXT, TOOL_OPTIONS } from './ContextBar.constants';
import { BrushOptions } from './sub-components/BrushOptions';
import { FillOptions } from './sub-components/FillOptions';
import { PixelPerfectOption } from './sub-components/PixelPerfectOption';
import { ScopeChips } from './sub-components/ScopeChips';
import { SelectOptions } from './sub-components/SelectOptions';
import { ShapeOptions } from './sub-components/ShapeOptions';
import { SymmetryOptions } from './sub-components/SymmetryOptions';
import './ContextBar.css';

const ContextBar = () => {
  const tool = useToolStore((state) => state.tool);
  const options = TOOL_OPTIONS[tool];
  return (
    <Flex wrap gap="md" align="center" role="group" aria-label={CONTEXT_TEXT.region} className="context-bar">
      <ScopeChips />
      {options.length > 0 && <Divider orientation="vertical" />}
      {options.includes('shape') && <ShapeOptions />}
      {options.includes('brush') && <BrushOptions />}
      {options.includes('pixelPerfect') && <PixelPerfectOption />}
      {options.includes('fill') && <FillOptions />}
      {options.includes('symmetry') && <SymmetryOptions />}
      {options.includes('select') && <SelectOptions />}
    </Flex>
  );
};

export { ContextBar };
