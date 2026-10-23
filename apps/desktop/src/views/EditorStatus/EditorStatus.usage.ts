/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the status line of the editor: the pixel under the pointer, the zoom, the front colour and whether the document has unsaved changes.',
  useWhen: [
    'The editor window needs one thin line of live facts at the foot of the canvas.',
    'The front colour must be shown with a swatch and its index and name.',
  ],
  avoidWhen: [
    { case: 'The line only shows whether a form is saved.', use: 'SaveBar' },
    { case: 'A generic bar of readouts is needed with no editor state.', use: 'StatusBar' },
  ],
  rules: [
    'The status reads the active document, the tool store and the readout store, so it takes no props.',
    'The cursor reads Outside when the pointer is not over the sprite.',
    'The saved state reads Saved or Unsaved changes, in words and in tone.',
    'A document restored from a recovery copy adds Recovered, not saved until it is saved.',
  ],
  a11y: [
    'The bar is a labelled region named Editor status.',
    'It is not a live region, so a moving cursor is never announced.',
  ],
  tree: {
    path: ['layout', 'window chrome', 'the status line at the foot'],
    rule: 'EditorStatus is the status line of the editor window, filled from the document and the tools.',
  },
  example: `import { EditorStatus } from '../EditorStatus';

const EditorFoot = () => <EditorStatus />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
