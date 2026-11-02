/* @layer core @kind constants */
import { z } from 'zod';
import { SIDE_SCHEMA } from '../schema/layout.constants';

const rect = z.strictObject({ x: z.number(), y: z.number(), width: z.number(), height: z.number() });

const WIDGET_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  label: z.string(),
  visible: z.boolean(),
  placement: z.enum(['docked', 'floating', 'popped']).nullable(),
  side: SIDE_SCHEMA.nullable(),
  size: z.number().nullable().describe('Pixels across (left, right) or down (top, bottom) when docked.'),
  index: z.number().nullable(),
  tab: z.number().nullable(),
  rect: rect.nullable().describe('The rectangle of a floating widget.'),
  popped: z.boolean(),
  available: z.boolean().describe('False when the widget does not apply to what is open now.'),
});

const TOOLBAR_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  label: z.string(),
  shown: z.boolean(),
  side: SIDE_SCHEMA.nullable(),
  row: z.number().nullable(),
  index: z.number().nullable(),
  labels: z.boolean(),
  columns: z.union([z.literal(1), z.literal(2), z.literal('auto')]).nullable().optional().describe('The columns set for a vertical toolbar, or null for the default.'),
  hiddenItems: z.array(z.string()).optional().describe('Item ids the owner hid in this toolbar.'),
});

export { TOOLBAR_ROW_SCHEMA, WIDGET_ROW_SCHEMA };
