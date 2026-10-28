/* @layer renderer-app @kind logic */
import type { Surface } from '../../surface/surface.type';
import type { ToolId } from '../tool.type';
import { optionSurface } from './option-surface';
import { OPTION_SPECS } from './option-specs.constants';
import type { OptionSpec } from './tool-options.type';

const optionsOf = (surface: Surface, tool: ToolId): OptionSpec[] => {
  const own = optionSurface(surface);
  if (own === null) return [];
  return OPTION_SPECS.filter((spec) => spec.surface === own && spec.tool === tool).sort((a, b) => a.priority - b.priority);
};

export { optionsOf };
