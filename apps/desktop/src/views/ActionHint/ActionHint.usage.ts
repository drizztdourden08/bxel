/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Wraps a control in a hint that shows its name, a one line description and its keys, with the keys drawn by the Tessera Shortcut part and read from the command keymap.',
  useWhen: [
    'An icon button, toggle or option in the editor needs to say what it does and which key runs it.',
    'A bar needs to teach the mouse and key controls of the canvas, such as the status bar.',
  ],
  avoidWhen: [
    { case: 'A plain label with no keys is enough.', use: 'Tooltip' },
    { case: 'The keys of the whole app are listed on a page of their own.', use: 'ShortcutList' },
  ],
  rules: [
    'Give the hint a name, a one line description and, when there are keys, a list of shortcuts. A shortcut names a command, so a rebind shows up, or fixed keys and a mouse gesture for what is not a command.',
    'Never put the key in the label of a button or a toggle. The label stays the plain name and the key lives only in the hint.',
    'A command with no key bound draws no key. A shortcut with only a label draws that label as a note.',
    'For a segmented control or a toggle group, give each option a tooltip with segmentOption or optionTooltip, so the control shows the name, the description and the key of the option under the pointer.',
    'Use placement right for a hint on a rail of tools that runs down an edge.',
  ],
  a11y: [
    'The hint is a tooltip: it opens on hover and on keyboard focus, closes on Escape and is linked to the control it describes.',
    'The control keeps its own accessible name, which holds the name and never the keys.',
  ],
  tree: {
    path: ['feedback', 'a hint for what is under the pointer'],
    rule: 'ActionHint is the Tooltip of the editor: it shows the name, the description and the keys of the control it wraps.',
  },
  example: `import { Button } from '@drizztdourden08/tessera';
import { ActionHint } from '../ActionHint';

const UndoButton = ({ onUndo }: { onUndo: () => void }) => (
  <ActionHint hint={{ name: 'Undo', description: 'Take back the last edit.', shortcuts: [{ command: 'history.undo' }] }}>
    <Button onClick={onUndo}>Undo</Button>
  </ActionHint>
);
`,
  propsHash: '90097519cdc837f2',
} satisfies ComponentUsage;

export { usage };
