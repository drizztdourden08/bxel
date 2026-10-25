/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows how the canvas looks with the current canvas settings, beside the settings it reflects.',
  useWhen: [
    'The Background section shows the checkerboard inside the surround.',
    'The Grid section shows the pixel, major and tile grids over the checkerboard.',
  ],
  avoidWhen: [{ case: 'The user edits the custom surround pattern.', use: 'SurroundEditor' }],
  rules: [
    'It takes the kind of preview: background or grid.',
    'It repaints on every change of the canvas settings and when its box resizes.',
    'The grid preview draws only the grids that are turned on.',
  ],
  a11y: ['The preview is a labelled image.'],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'CanvasPreview draws a live sample of the canvas look on a settings page.',
  },
  example: `import { CanvasPreview } from '../CanvasPreview';

const GridPreviewRow = () => <CanvasPreview kind="grid" />;
`,
  propsHash: 'b7255ed288482f6f',
} satisfies ComponentUsage;

export { usage };
