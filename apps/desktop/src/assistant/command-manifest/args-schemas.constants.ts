/* @layer renderer-app @kind constants */
import { z } from 'zod';

const index = z.number().int().min(0).max(255);
const coordinate = z.number().int().min(-100000).max(100000);

const optionValue = z.union([z.string(), z.number(), z.boolean()]).describe('The new value. A choice takes one of its values, a number is clamped to its range, a toggle takes true or false.');

const ANCHOR_VALUES = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'] as const;

const ARGS_KINDS = {
  layer: z.strictObject({ layerId: z.string().min(1).describe('A layer id from get_document. Without it the active layer is used.').optional() }),
  swatch: z.strictObject({ index, slot: z.number().int().min(0).max(3).describe('0 foreground, 1 background, 2 third, 3 fourth.').optional() }),
  pixel: z.strictObject({ x: coordinate, y: coordinate }),
  pickHere: z.strictObject({ x: coordinate, y: coordinate, slot: z.number().int().min(0).max(3).optional() }),
  tile: z.strictObject({ key: z.number().int().min(0) }),
  tab: z.strictObject({ tabId: z.string().min(1).describe('A tab id from get_view.') }),
  path: z.strictObject({ path: z.string().min(1), tabId: z.string().min(1).optional() }),
  zoom: z.strictObject({ percent: z.number().min(1).max(6400) }),
  align: z.strictObject({ mode: z.enum(['left', 'center', 'right', 'top', 'middle', 'bottom', 'horizontal', 'vertical']) }),
  sheet: z.strictObject({ sheetId: z.string().min(1) }),
  name: z.strictObject({ name: z.string().min(1).max(200) }),
  trait: z.strictObject({ kind: z.enum(['tag', 'size', 'bank']), value: z.string().min(1) }),
  axis: z.strictObject({ axis: z.enum(['x', 'y']), position: z.number() }),
  unit: z.strictObject({ unit: z.string().min(1) }),
  frame: z.strictObject({ frameId: z.string().min(1) }),
  duration: z.strictObject({ ms: z.number().int().min(10).max(60000) }),
  tag: z.strictObject({ tagId: z.string().min(1), direction: z.enum(['forward', 'reverse', 'pingpong', 'pingpongReverse']).optional(), colour: z.string().nullable().optional() }),
  byColour: z.strictObject({ index, mode: z.enum(['region', 'everywhere']).default('everywhere'), x: coordinate.optional(), y: coordinate.optional() }),
  flipped: z.strictObject({ flipped: z.boolean().default(false) }),
  rotate: z.strictObject({ angle: z.number().min(-360).max(360).describe('Degrees, clockwise.'), bounds: z.enum(['expand', 'crop']).default('crop') }),
  scale: z.strictObject({ width: z.number().int().min(1).max(4096), height: z.number().int().min(1).max(4096), bounds: z.enum(['expand', 'crop']).default('crop') }),
  canvasSize: z.strictObject({ width: z.number().int().min(1).max(4096), height: z.number().int().min(1).max(4096), anchor: z.enum(ANCHOR_VALUES).default('top-left') }),
  deleteSwatch: z.strictObject({ index: z.number().int().min(1).max(255) }),
  mergeSwatch: z.strictObject({ index: z.number().int().min(1).max(255), into: index }),
  optionValue: z.strictObject({ value: optionValue.optional() }),
  optionTarget: z.strictObject({ tool: z.string().min(1).optional(), option: z.string().min(1).describe('An option id from list_commands or the option model, such as fill.area.').optional(), value: optionValue.optional() }),
  preset: z.strictObject({ id: z.string().min(1).describe('A preset id, such as builtin.pencil-2.') }),
  colourLimit: z.strictObject({ cap: z.number().int().min(2).max(256) }),
} as const;

const argsJson = (kind: keyof typeof ARGS_KINDS): Record<string, unknown> => ({ ...z.toJSONSchema(ARGS_KINDS[kind], { io: 'input', unrepresentable: 'any' }) });

export { ARGS_KINDS, argsJson };
