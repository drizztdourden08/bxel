/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the rules of a target platform in one line and lists every place the file or the form breaks them, as warnings.',
  useWhen: [
    'A file or a new file form has a platform and the user must see what falls outside its rules.',
    'The same findings are needed in the New dialog and in the Palette widget.',
  ],
  avoidWhen: [
    { case: 'A single field has an error.', use: 'Field' },
    { case: 'A blocking message about one action.', use: 'Callout' },
  ],
  rules: [
    'Pass the report of the platform check. It never blocks work: every finding is a warning or a note.',
    'A finding outside the rules shows in the danger tone, a check in the warning tone and a note in the info tone.',
    'With no findings the view says that everything fits.',
  ],
  a11y: [
    'The list is a polite live region, so a new finding is announced when the file changes.',
    'Each finding names its kind in words, not only in color.',
  ],
  tree: {
    path: ['a status, a count or a label', 'the state something is in'],
    rule: 'PlatformFindings lists where a file breaks the rules of its platform.',
  },
  example: `import { PlatformFindings } from '../PlatformFindings';
import type { PlatformReport } from '../../platform-preset/platform-preset.type';

const Findings = ({ report }: { report: PlatformReport }) => <PlatformFindings report={report} />;
`,
  propsHash: '281c5f418cb55903',
} satisfies ComponentUsage;

export { usage };
