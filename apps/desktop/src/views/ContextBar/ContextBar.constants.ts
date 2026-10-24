/* @layer renderer-app @kind constants */
import type { BrushShape, Connectivity } from '@bxel/raster';
import type { ToolId } from '../../editor/tool.type';
import type { OptionKind } from './ContextBar.type';

const CONTEXT_TEXT = {
  region: 'Tool options',
  scope: 'Edit scope',
  sprite: (name: string): string => `Sprite: ${name}`,
  layer: (name: string, state: string): string => (state === '' ? `Layer: ${name}` : `Layer: ${name} (${state})`),
  frame: (at: number, total: number): string => `Frame: ${at} of ${total}`,
  size: 'Brush size',
  brushShape: 'Brush shape',
  square: 'Square',
  circle: 'Circle',
  pixelPerfect: 'Pixel perfect',
  fillMode: 'Fill area',
  neighbours: 'Fill neighbours',
  shapeKind: 'Shape kind',
  filled: 'Filled',
  symmetry: 'Symmetry',
  mirrorX: 'Mirror X  Alt+X',
  mirrorY: 'Mirror Y  Alt+Y',
  selectVariant: 'Selection shape',
  selectMode: 'Selection mode',
  wandNeighbours: 'Wand neighbours',
  expand: 'Expand 1',
  shrink: 'Shrink 1',
} as const;

const TOOL_OPTIONS: Readonly<Record<ToolId, readonly OptionKind[]>> = {
  pencil: ['brush', 'pixelPerfect', 'symmetry'],
  eraser: ['brush', 'pixelPerfect', 'symmetry'],
  fill: ['fill'],
  picker: [],
  shape: ['shape', 'brush', 'symmetry'],
  zoom: [],
  hand: [],
  select: ['select'],
  move: [],
};

const BRUSH_SHAPES: readonly BrushShape[] = ['square', 'circle'];

const NEIGHBOUR_CHOICES: Readonly<Record<Connectivity, string>> = { 4: '4', 8: '8' };

export { BRUSH_SHAPES, CONTEXT_TEXT, NEIGHBOUR_CHOICES, TOOL_OPTIONS };
