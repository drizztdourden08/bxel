/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';

const layout = defineLayoutPreset({
  rows: [['main', 'palette']],
  widths: [[0.8, 0.2]],
});

export default layout;
