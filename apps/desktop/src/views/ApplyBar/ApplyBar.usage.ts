/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Tells what a pending edit will touch and holds Cancel and Apply in a Tessera FloatingPrompt, so a transform, move or paste is committed only after the user has seen it on the canvas.',
  useWhen: [
    'A flip, turn, rotate, scale, move or paste is previewed on the canvas and waits for a decision.',
    'The user must see the targets, layers, frames and clipping before one undo step is written.',
  ],
  avoidWhen: [
    { case: 'The edit applies at once, such as a pencil stroke or a layer command.', use: 'OptionsToolbar' },
    { case: 'The edit needs typed values before it can preview.', use: 'TransformDialog' },
  ],
  rules: [
    'The bar reads the pending edit and its preview from the pending store, so it takes no props and shows nothing when no edit waits.',
    'The message names the edit, then lists Targets, Layers, Frames and Clipping. Apply is the first action and Cancel is marked as the way out, so Escape cancels.',
    'Apply is off while the preview reports an error, and the bar then turns to the danger tone and shows the error.',
    'It floats over the foot of the canvas area, takes no layout space and makes the canvas inert until the user picks Apply or Cancel. The arrow keys still nudge a moving selection.',
  ],
  a11y: [
    'The bar is an alert dialog named Apply bar, so a screen reader hears the edit and its scope when it opens.',
    'Focus moves to Apply when the bar opens and returns to the canvas when it closes.',
  ],
  tree: {
    path: ['feedback', 'a question that blocks one region until it is answered'],
    rule: 'ApplyBar is the FloatingPrompt of the editor that asks for a decision on a previewed edit.',
  },
  example: `import { ApplyBar } from '../ApplyBar';

const EditorFoot = () => <ApplyBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
