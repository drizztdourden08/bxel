/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows how the canvas looks with the current canvas settings, beside the settings it reflects.',
  useWhen: [
    'The Grid and rulers page shows the pixel, major and tile grids over the checkerboard.',
    'The Surround pattern page shows the surround with a canvas on it.',
    'The Canvas page shows the checkerboard behind a few transparent and opaque pixels.',
  ],
  avoidWhen: [{ case: 'The user edits the custom surround pattern.', use: 'SurroundEditor' }],
  rules: [
    'It takes the kind of preview: canvas, grid or surround.',
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
  propsHash: '8f5f61eb831bc6f1',
} satisfies ComponentUsage;

export { usage };
