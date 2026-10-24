/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows what a pending edit will touch, then holds Cancel and Apply, so a transform, move or paste is committed only after the user has seen it on the canvas.',
  useWhen: [
    'A flip, turn, rotate, scale, move or paste is previewed on the canvas and waits for a decision.',
    'The user must see the targets, layers, frames and clipping before one undo step is written.',
  ],
  avoidWhen: [
    { case: 'The edit applies at once, such as a pencil stroke or a layer command.', use: 'ContextBar' },
    { case: 'The edit needs typed values before it can preview.', use: 'TransformDialog' },
  ],
  rules: [
    'The bar reads the pending edit and its preview from the pending store, so it takes no props and shows nothing when no edit waits.',
    'It lists Targets, Layers, Frames and Clipping, then Cancel and Apply. Enter applies and Escape cancels, as commands.',
    'Apply is off while the preview reports an error, and the error shows in the bar.',
  ],
  a11y: [
    'The bar is a labelled region and its scope chips are a status, so a screen reader hears the scope when the bar opens.',
    'Cancel and Apply are buttons in the tab order, with the same keys as the commands.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'ApplyBar is the strip under the canvas that asks for a decision on a previewed edit.',
  },
  example: `import { ApplyBar } from '../ApplyBar';

const EditorFoot = () => <ApplyBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
