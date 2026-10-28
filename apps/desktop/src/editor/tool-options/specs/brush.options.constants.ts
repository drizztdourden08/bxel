/* @layer renderer-app @kind constants */
import type { BrushShape } from '@bxel/raster';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { BRUSH_TIP_CHOICES, OPTION_TEXT } from '../tool-options.constants';
import type { OptionBase, OptionSpec } from '../tool-options.type';
import type { BrushTool } from './brush.options.type';

const tools = () => useToolStore.getState();

const asTip = (value: unknown): BrushShape => (value === 'circle' ? 'circle' : 'square');

const brushBase = (tool: BrushTool): OptionBase => ({ tool, surface: 'paint', memory: 'tool' });

const sizeOption = (tool: BrushTool, priority: number): OptionSpec => ({
  ...brushBase(tool),
  id: `${tool}.size`,
  name: 'size',
  kind: 'number',
  label: OPTION_TEXT.size,
  description: OPTION_TEXT.sizeDescription,
  tier: 1,
  priority,
  group: 'brush',
  default: BRUSH_SIZE.min,
  min: BRUSH_SIZE.min,
  max: BRUSH_SIZE.max,
  step: 1,
  shortcuts: [
    { command: COMMAND_ID.brushSmaller, label: 'Smaller' },
    { command: COMMAND_ID.brushLarger, label: 'Larger' },
  ],
  read: () => tools().brushSize,
  write: (value) => tools().setBrushSize(Number(value)),
});

const tipOption = (tool: BrushTool, priority: number): OptionSpec => ({
  ...brushBase(tool),
  id: `${tool}.tip`,
  name: 'tip',
  kind: 'choice',
  label: OPTION_TEXT.tip,
  description: OPTION_TEXT.tipDescription,
  tier: 1,
  priority,
  group: 'brush',
  default: 'square',
  choices: BRUSH_TIP_CHOICES,
  command: OPTION_COMMAND.cycleTip,
  read: () => tools().brushShape,
  write: (value) => tools().setBrushShape(asTip(value)),
});

const pixelPerfectOption = (tool: BrushTool, priority: number): OptionSpec => ({
  ...brushBase(tool),
  id: `${tool}.pixel_perfect`,
  name: 'pixel_perfect',
  kind: 'toggle',
  label: OPTION_TEXT.pixelPerfect,
  description: OPTION_TEXT.pixelPerfectDescription,
  tier: 1,
  priority,
  group: 'brush',
  default: false,
  icon: 'pixel-pixel-perfect',
  caption: OPTION_TEXT.pixelPerfect,
  command: OPTION_COMMAND.pixelPerfect,
  chord: 'P',
  shortcuts: [{ command: OPTION_COMMAND.pixelPerfect }],
  read: () => tools().pixelPerfect,
  write: (value) => tools().setPixelPerfect(value === true),
});

const BRUSH_OPTIONS: readonly OptionSpec[] = [
  sizeOption('pencil', 10),
  tipOption('pencil', 20),
  pixelPerfectOption('pencil', 30),
  sizeOption('eraser', 10),
  tipOption('eraser', 20),
  pixelPerfectOption('eraser', 30),
  sizeOption('shape', 30),
  tipOption('shape', 40),
];

export { BRUSH_OPTIONS };
