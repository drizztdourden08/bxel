/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOLBAR_ROW_SCHEMA, WIDGET_ROW_SCHEMA } from './list-layout-tool.constants';
import { NO_INPUT_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const listLayoutTool = defineTool(TOOL_NAME.listLayout, {
  title: 'List the layout',
  description:
    'The widgets (Canvas, Layers, Tool options, Palette, Project, Sheet, Tileset, Timeline, Tools) with where each is docked, floating or popped out, and the toolbars with their side and labels, plus the names of the layout presets. Change them with set_layout.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({ widgets: z.array(WIDGET_ROW_SCHEMA), toolbars: z.array(TOOLBAR_ROW_SCHEMA), presets: z.array(z.string()) }),
});

export { listLayoutTool };
