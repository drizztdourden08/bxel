/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { CANVAS_TEXT, CanvasToolbar } from '../views/CanvasToolbar';

export default defineToolbar({
  id: 'canvas',
  label: CANVAS_TEXT.region,
  defaultSide: 'top',
  render: (slot) => <CanvasToolbar slot={slot} />,
});
