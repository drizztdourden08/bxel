/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The file browser of the Project window: folders, a grid, list or columns of files with pixel thumbnails, a large preview with playback, a search with tokens, and the file operations.',
  useWhen: [
    'The Browse page of the Project window.',
    'A closed project is looked at read only from its folder.',
  ],
  avoidWhen: [{ case: 'A narrow dock list of project files.', use: 'ItemList' }],
  rules: [
    'It takes the open project, or the project read from disk when it is closed.',
    'Grid, list and columns show the same entries and keep the selection when the view changes.',
    'A move, rename or trash goes through the file operations layer, so the files that link to the moved file are rewritten.',
    'The view, sort, size and folder are kept per project in the owner settings, never in the project file.',
  ],
  a11y: [
    'Tiles are grid cells named by the file, with the selected state set.',
    'Every mark on a file has a name for a screen reader.',
    'The keys act on the selection: F2, Delete, Enter, Alt+Enter, Ctrl+A, Ctrl+D, Backspace and Escape.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'ProjectBrowser is the one place to browse the files of a project.',
  },
  example: `import { ProjectBrowser } from '../ProjectBrowser';

const BrowsePage = () => <ProjectBrowser project={null} disk={null} />;
`,
  propsHash: '662d185130f2a7c6',
} satisfies ComponentUsage;

export { usage };
