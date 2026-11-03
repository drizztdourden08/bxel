/* @layer core @kind constants */
import { z } from 'zod';

const SIDE_VALUES = ['left', 'right', 'top', 'bottom'] as const;

const SIDE_SCHEMA = z.enum(SIDE_VALUES);

const FLOAT_RECT_SCHEMA = z.strictObject({
  x: z.number().int().optional(),
  y: z.number().int().optional(),
  width: z.number().int().min(80).max(8000),
  height: z.number().int().min(60).max(8000),
});

const widget = z.string().min(1).max(64).describe('A widget id from list_layout.');

const toolbar = z.string().min(1).max(64).describe('A toolbar id from list_layout.');

const memberId = z.string().min(1).max(64).describe('A tool member id from list_tools.');

const COLUMNS_SCHEMA = z.union([z.literal(1), z.literal(2), z.literal('auto'), z.null()]).describe('1 or 2 columns, auto for as many as fit, or null for the default.');

const TOOL_LAYOUT_OPS = [
  z.strictObject({ op: z.literal('toolbarColumns'), toolbar, columns: COLUMNS_SCHEMA }),
  z.strictObject({ op: z.literal('toolbarItems'), toolbar, hidden: z.array(z.string().min(1).max(64)).max(64).describe('Item ids to hide in the toolbar. An empty list shows them all.') }),
  z.strictObject({ op: z.literal('hideTool'), member: memberId }),
  z.strictObject({ op: z.literal('showTool'), member: memberId }),
  z.strictObject({
    op: z.literal('moveTool'),
    member: memberId,
    slot: z.string().min(1).max(64).optional().describe('A slot id from list_tools to join. Without it the member gets a slot of its own.'),
    surface: z.enum(['sprite', 'tile', 'map', 'sheet']).optional().describe('The surface whose rail changes. Without it the surface that is open.'),
  }),
  z.strictObject({ op: z.literal('resetTools'), surface: z.enum(['sprite', 'tile', 'map', 'sheet']).optional().describe('One surface. Without it every surface is reset.') }),
] as const;

const LAYOUT_OP_SCHEMA = z.discriminatedUnion('op', [
  z.strictObject({ op: z.literal('show'), widget }),
  z.strictObject({ op: z.literal('hide'), widget }),
  z.strictObject({ op: z.literal('toggle'), widget }),
  z.strictObject({ op: z.literal('popOut'), widget }),
  z.strictObject({ op: z.literal('focus'), widget }),
  z.strictObject({
    op: z.literal('dock'),
    widget,
    side: SIDE_SCHEMA,
    size: z.number().int().min(40).max(4000).optional().describe('Pixels across (left, right) or down (top, bottom).'),
    index: z.number().int().min(0).max(16).optional(),
  }),
  z.strictObject({ op: z.literal('float'), widget, rect: FLOAT_RECT_SCHEMA }),
  z.strictObject({
    op: z.literal('resize'),
    widget,
    size: z.number().int().min(40).max(4000).optional(),
    rect: FLOAT_RECT_SCHEMA.optional(),
  }),
  z.strictObject({ op: z.literal('applyPreset'), name: z.string().min(1).max(64) }),
  z.strictObject({ op: z.literal('resetWidgets') }),
  z.strictObject({ op: z.literal('showToolbar'), toolbar }),
  z.strictObject({ op: z.literal('hideToolbar'), toolbar }),
  z.strictObject({ op: z.literal('toolbarSide'), toolbar, side: SIDE_SCHEMA, row: z.number().int().min(0).max(8).optional() }),
  z.strictObject({ op: z.literal('toolbarLabels'), toolbar, on: z.boolean() }),
  z.strictObject({ op: z.literal('resetToolbars') }),
  ...TOOL_LAYOUT_OPS,
]);

const SETTING_SCOPE_VALUES = ['app', 'project', 'asset'] as const;

const SETTING_SCOPE_SCHEMA = z.enum(SETTING_SCOPE_VALUES);

export { LAYOUT_OP_SCHEMA, SETTING_SCOPE_SCHEMA, SETTING_SCOPE_VALUES, SIDE_SCHEMA };
