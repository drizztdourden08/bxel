/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Inspector panel for transforms: it says whether an action acts on the selection or the whole sprite, and starts a flip, a quarter turn, a rotate or a scale.',
  useWhen: [
    'The user wants the transform actions on screen beside the canvas, with the same results as the Edit menu.',
    'The user needs to know what the next transform will touch before starting it.',
  ],
  avoidWhen: [
    { case: 'A key press or the menu is enough.', use: 'ContextBar' },
    { case: 'The edit waits for a decision.', use: 'ApplyBar' },
  ],
  rules: [
    'The panel reads the selection and the open document, so it takes no props.',
    'With a selection the actions use the pixels commands, and without one the sprite commands.',
    'Each action starts a preview and the Apply bar. Nothing is committed from the panel.',
  ],
  a11y: [
    'The actions are a labelled group of buttons, each with its key in the tooltip.',
    'The note above the buttons names the target in words.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'TransformPanel is the dock panel that lists the transform actions of the editor.',
  },
  example: `import { TransformPanel } from '../TransformPanel';

const EditorDock = () => <TransformPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
