/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lays out the main content of an App settings page beside its preview when the page is wide, and stacks the preview above it when the page is narrow.',
  useWhen: [
    'A settings page has a live preview of what its settings change.',
    'A page shows the details of a choice with a picture of it beside them.',
  ],
  avoidWhen: [{ case: 'The page is a list with a detail pane that is picked from it.', use: 'ListDetailLayout' }],
  rules: [
    'It takes main, the content of the page, and preview, the sample.',
    'It answers the width of its own page, not the window: two columns from 900 px, one column below.',
    'In two columns the preview stays in view while the main column scrolls.',
    'The preview is a labelled complementary region.',
  ],
  a11y: ['The preview pane is an aside named Preview, so it is a stop of the region keys.'],
  tree: {
    path: ['layout', 'two panes the user resizes'],
    rule: 'PreviewSplit puts a page and its preview side by side when there is room.',
  },
  example: `import { PreviewSplit } from '../PreviewSplit';

const Page = () => <PreviewSplit main={<p>Rows</p>} preview={<p>Sample</p>} />;
`,
  propsHash: '0239d96cab820c45',
} satisfies ComponentUsage;

export { usage };
