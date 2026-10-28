/* @layer renderer-app @kind logic */
import type { Surface } from '../tool-catalogue/surface.type';
import type { ToolId } from '../tool.type';
import { MEMBER_OPTIONS } from './member-options.constants';
import { optionsOf } from './options-of';
import type { OptionSpec } from './tool-options.type';

const memberOptions = (surface: Surface, tool: ToolId): OptionSpec[] =>
  optionsOf(surface, tool).filter((spec) => spec.tier === 1 && !MEMBER_OPTIONS.includes(spec.id));

export { memberOptions };
