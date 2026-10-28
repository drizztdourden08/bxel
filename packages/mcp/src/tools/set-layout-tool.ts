/* @layer core @kind logic */
import { z } from 'zod';
import { LAYOUT_OP_SCHEMA } from '../schema/layout.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOLBAR_ROW_SCHEMA, WIDGET_ROW_SCHEMA } from './list-layout-tool';
import { TOOL_NAME } from './tool-name.constants';

const setLayoutTool = defineTool(TOOL_NAME.setLayout, {
  title: 'Set the layout',
  description:
    'Changes the layout of the owner window, one op after the other, and the owner watches it. Widget ops: show, hide, toggle, popOut, focus, dock {side, size, index}, float {rect}, resize {size or rect}, applyPreset {name}, resetWidgets. Toolbar ops: showToolbar, hideToolbar, toolbarSide {side, row}, toolbarLabels {on}, resetToolbars. The result persists like a drag by the owner. An op that fails stops the run and the ops before it stay applied.',
  input: z.strictObject({ ops: z.array(LAYOUT_OP_SCHEMA).min(1).max(32) }),
  output: withFailure({
    applied: z.number().int().min(0),
    widgets: z.array(WIDGET_ROW_SCHEMA),
    toolbars: z.array(TOOLBAR_ROW_SCHEMA),
  }),
});

export { setLayoutTool };
