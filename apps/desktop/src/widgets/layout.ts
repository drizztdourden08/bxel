/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';

const layout = defineLayoutPreset({
  rows: [
    ['main', 'palette'],
    ['timeline', 'sprites', 'tileset'],
  ],
  widths: [[0.78, 0.22], [0.5, 0.3, 0.2]],
  sizes: [0.68, 0.32],
});

export default layout;
