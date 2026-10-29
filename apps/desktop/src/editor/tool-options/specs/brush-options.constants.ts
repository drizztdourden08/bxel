/* @layer renderer-app @kind constants */
import { BRUSH_ANGLES } from '@bxel/raster';
import type { BrushAngle, BrushShape } from '@bxel/raster';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { BRUSH_ANGLE_CHOICES, BRUSH_TIP_CHOICES, OPTION_TEXT } from '../tool-options.constants';
import type { OptionBase, OptionSpec } from '../tool-options.type';
import type { BrushTool } from './brush-options.type';

const tools = () => useToolStore.getState();

const asTip = (value: unknown): BrushShape => (value === 'circle' || value === 'line' ? value : 'square');

const asAngle = (value: unknown): BrushAngle => BRUSH_ANGLES.find((angle) => String(angle) === String(value)) ?? 0;

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

const angleOption = (tool: BrushTool, priority: number): OptionSpec => ({
  ...brushBase(tool),
  id: `${tool}.angle`,
  name: 'angle',
  kind: 'choice',
  label: OPTION_TEXT.angle,
  description: OPTION_TEXT.angleDescription,
  tier: 1,
  priority,
  group: 'brush',
  default: '0',
  choices: BRUSH_ANGLE_CHOICES,
  read: () => String(tools().brushAngle),
  write: (value) => tools().setBrushAngle(asAngle(value)),
  appliesWhen: () => tools().brushShape === 'line',
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
  appliesWhen: () => tools().brushSize === 1,
});

const BRUSH_OPTIONS: readonly OptionSpec[] = [
  sizeOption('pencil', 10),
  tipOption('pencil', 20),
  angleOption('pencil', 21),
  pixelPerfectOption('pencil', 30),
  sizeOption('eraser', 10),
  tipOption('eraser', 20),
  angleOption('eraser', 21),
  pixelPerfectOption('eraser', 30),
  sizeOption('shade', 10),
  tipOption('shade', 20),
  angleOption('shade', 21),
  sizeOption('line', 30),
  tipOption('line', 40),
  angleOption('line', 41),
  sizeOption('curve', 30),
  tipOption('curve', 40),
  angleOption('curve', 41),
  sizeOption('rect', 30),
  tipOption('rect', 40),
  angleOption('rect', 41),
  sizeOption('ellipse', 30),
  tipOption('ellipse', 40),
  angleOption('ellipse', 41),
  sizeOption('contour', 30),
  tipOption('contour', 40),
  angleOption('contour', 41),
  sizeOption('polygon', 30),
  tipOption('polygon', 40),
  angleOption('polygon', 41),
];

export { BRUSH_OPTIONS };
