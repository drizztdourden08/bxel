/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { OPTION_TEXT, SHAPE_KIND_CHOICES } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';

const tools = () => useToolStore.getState();

const asKind = (value: unknown): ShapeKind => (value === 'rect' || value === 'ellipse' ? value : 'line');

const SHAPE_OPTIONS: readonly OptionSpec[] = [
  {
    id: 'shape.kind',
    name: 'kind',
    tool: 'shape',
    surface: 'paint',
    memory: 'global',
    kind: 'choice',
    label: OPTION_TEXT.shapeKind,
    description: OPTION_TEXT.shapeKindDescription,
    tier: 1,
    priority: 10,
    group: 'shape',
    default: 'line',
    choices: SHAPE_KIND_CHOICES,
    command: OPTION_COMMAND.shapeKind,
    read: () => tools().shape,
    write: (value) => tools().setShape(asKind(value)),
  },
  {
    id: 'shape.filled',
    name: 'filled',
    tool: 'shape',
    surface: 'paint',
    memory: 'global',
    kind: 'toggle',
    label: OPTION_TEXT.filled,
    description: OPTION_TEXT.filledDescription,
    tier: 1,
    priority: 20,
    group: 'shape',
    default: false,
    icon: 'pixel-shape-rect-filled',
    caption: OPTION_TEXT.filled,
    command: OPTION_COMMAND.shapeFilled,
    flyout: true,
    read: () => tools().filled,
    write: (value) => tools().setFilled(value === true),
    disabledReason: () => (tools().shape === 'line' ? OPTION_TEXT.linesHaveNoInside : undefined),
  },
];

export { SHAPE_OPTIONS };
