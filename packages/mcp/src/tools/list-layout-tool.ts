/* @layer core @kind logic */
import { z } from 'zod';
import { SIDE_SCHEMA } from '../schema/layout.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { NO_INPUT_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

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
});

const listLayoutTool = defineTool(TOOL_NAME.listLayout, {
  title: 'List the layout',
  description:
    'The widgets (Canvas, Layers, Tool options, Palette, Project, Sheet, Tileset, Timeline, Tools) with where each is docked, floating or popped out, and the toolbars with their side and labels, plus the names of the layout presets. Change them with set_layout.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({ widgets: z.array(WIDGET_ROW_SCHEMA), toolbars: z.array(TOOLBAR_ROW_SCHEMA), presets: z.array(z.string()) }),
});

export { listLayoutTool, TOOLBAR_ROW_SCHEMA, WIDGET_ROW_SCHEMA };
