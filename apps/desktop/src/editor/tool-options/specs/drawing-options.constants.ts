/* @layer renderer-app @kind constants */
import type { OptionSpec } from '../tool-options.type';
import { BRUSH_EXTRAS, LOCK_OPTIONS, SPACING_OPTIONS, TIP_OPTIONS } from './brush-extra-options.constants';
import { GRADIENT_OPTIONS } from './gradient-options.constants';
import { INK_OPTIONS } from './ink-options.constants';
import { SHAPE_EXTRA_OPTIONS } from './shape-extra-options.constants';
import { TOOL_EXTRA_OPTIONS } from './tool-extra-options.constants';

const DRAWING_OPTIONS: readonly OptionSpec[] = [...INK_OPTIONS, ...SHAPE_EXTRA_OPTIONS, ...TOOL_EXTRA_OPTIONS, ...GRADIENT_OPTIONS, ...BRUSH_EXTRAS, ...TIP_OPTIONS, ...SPACING_OPTIONS, ...LOCK_OPTIONS];

export { DRAWING_OPTIONS };
