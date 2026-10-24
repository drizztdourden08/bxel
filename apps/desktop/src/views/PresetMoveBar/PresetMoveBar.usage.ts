/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Offers once to move the export presets saved in the app into the open project, or to keep them as app presets.',
  useWhen: ['A project is the active document and the app still holds saved export presets that were never offered for a move.'],
  avoidWhen: [
    { case: 'A message only informs and offers nothing.', use: 'Toast' },
    { case: 'An older file holds several assets and must be split.', use: 'LegacyBar' },
  ],
  rules: [
    'The bar reads the active workspace and the app settings and takes no props.',
    'Move writes every app preset into the project as one undo step; Keep leaves them as app presets.',
    'Either answer ends the offer; no preset is deleted without being moved first.',
  ],
  a11y: ['The bar is a status region, so the question is read when it shows.', 'Both buttons are in tab order after the question.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'PresetMoveBar asks where the saved export presets should live and answers with one click.',
  },
  example: `import { PresetMoveBar } from '../PresetMoveBar';

const EditorHeader = () => <PresetMoveBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
