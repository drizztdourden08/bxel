/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Tells what a pending edit will touch and holds Cancel and Apply in a card that floats beside the pending selection, so a transform, move or paste is committed only after the user has seen it on the canvas.',
  useWhen: [
    'A flip, turn, rotate, scale, move or paste is previewed on the canvas and waits for a decision.',
    'The user must see the targets, layers and clipping before one undo step is written.',
  ],
  avoidWhen: [
    { case: 'The edit applies at once, such as a pencil stroke or a layer command.', use: 'OptionsToolbar' },
    { case: 'The edit needs typed values before it can preview.', use: 'TransformDialog' },
  ],
  rules: [
    'The bar reads the pending edit and its preview from the pending store, so it takes no props and shows nothing when no edit waits.',
    'The card names the edit, then lists Targets, Layers and Clipping. Apply takes the focus and Escape cancels. A move or a paste also shows that the arrow keys nudge.',
    'Apply is off while the preview reports an error, and the bar then turns to the danger tone and shows the error.',
    'It sits under the pending selection, or above it when there is no room, and stays inside the stage. When the selection is off screen it drops to the top of the stage. It takes no layout space, so the canvas never moves.',
  ],
  a11y: [
    'The bar is a non modal alert dialog named Apply bar, so a screen reader hears the edit and its scope when it opens.',
    'Focus moves to Apply when the bar opens and returns to where it was when it closes.',
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
