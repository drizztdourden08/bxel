/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks once, when the owner first paints on a linked cel, whether to paint this use only or every use, and remembers the answer for the session.',
  useWhen: ['A paint tool is pressed on a cel that is shared with other frames or layers and no answer has been given yet.'],
  avoidWhen: [{ case: 'A single yes or no question is enough.', use: 'Dialog' }],
  rules: [
    'The dialog reads its open state from the app and takes no props.',
    'This use only unlinks the cel before the stroke, in the same undo step. All uses sends allUses with the stroke.',
    'The press that opened the dialog paints nothing; the owner paints again after choosing.',
  ],
  a11y: ['The dialog traps focus, closes with Escape and returns focus to the editor.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'LinkedCelDialog is the one time choice for painting on a linked cel.',
  },
  example: `import { LinkedCelDialog } from '../LinkedCelDialog';

const EditorOverlays = () => <LinkedCelDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
