/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Health page of the Project window: the checks of the open project, each with the files it found and the fix for them.',
  useWhen: [
    'The Health page of the Project window.',
    'The owner follows the problem count from the status bar or the Project menu.',
  ],
  avoidWhen: [{ case: 'The files of the open project.', use: 'ProjectBrowser' }],
  rules: [
    'It takes no props. The findings come from a scan of the project files, refreshed when the files change.',
    'A link fix writes the manifest of the file that holds the link and nothing else, so unsaved edits stay.',
    'Unused files are a hint, not an error.',
  ],
  a11y: [
    'Each check is a named section with its count, and each row names the file and the link target.',
    'The summary line is a status that changes when the scan ends.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'ProjectHealth shows what is wrong in the project and fixes it.',
  },
  example: `import { ProjectHealth } from '../ProjectHealth';

const HealthPage = () => <ProjectHealth />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
