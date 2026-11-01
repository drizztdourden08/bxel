/* @layer renderer-app @kind constants */
import { BRUSH_OPTIONS } from './specs/brush-options.constants';
import { FILL_OPTIONS } from './specs/fill-options.constants';
import { MAP_OPTIONS } from './specs/map-options.constants';
import { SELECT_MARQUEE_OPTIONS } from './specs/select-marquee-options.constants';
import { SELECT_OPTIONS } from './specs/select-options.constants';
import { DRAWING_OPTIONS } from './specs/drawing-options.constants';
import type { OptionSpec } from './tool-options.type';

const OPTION_SPECS: readonly OptionSpec[] = [...BRUSH_OPTIONS, ...FILL_OPTIONS, ...DRAWING_OPTIONS, ...SELECT_OPTIONS, ...SELECT_MARQUEE_OPTIONS, ...MAP_OPTIONS];

export { OPTION_SPECS };
