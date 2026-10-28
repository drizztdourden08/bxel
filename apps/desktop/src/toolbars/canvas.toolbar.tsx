/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { TOOLBAR_FLAG } from '../ui-context/widget-context.constants';
import { CANVAS_TEXT, CanvasToolbar } from '../views/CanvasToolbar';

export default defineToolbar({
  id: 'canvas',
  label: CANVAS_TEXT.region,
  defaultSide: 'top',
  when: { when: (ctx) => ctx.flags[TOOLBAR_FLAG.canvas] !== false },
  render: (slot) => <CanvasToolbar slot={slot} />,
});
