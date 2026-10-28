/* @layer renderer-app @kind constants */
import { BRUSH_OPTIONS } from './specs/brush-options.constants';
import { FILL_OPTIONS } from './specs/fill-options.constants';
import { MAP_OPTIONS } from './specs/map-options.constants';
import { SELECT_OPTIONS } from './specs/select-options.constants';
import { SHAPE_OPTIONS } from './specs/shape-options.constants';
import type { OptionSpec } from './tool-options.type';

const OPTION_SPECS: readonly OptionSpec[] = [...BRUSH_OPTIONS, ...FILL_OPTIONS, ...SHAPE_OPTIONS, ...SELECT_OPTIONS, ...MAP_OPTIONS];

export { OPTION_SPECS };
