/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the settings sections of an App page with a live preview in the preview column of the Brock settings layout: beside the rows when the page is wide, above them when it is narrow.',
  useWhen: [
    'A custom App page has settings rows and a sample that reacts to them.',
    'The Grid and rulers, Surround pattern and Canvas pages show their rows and their preview.',
  ],
  avoidWhen: [{ case: 'The page is plain rows with no preview.', use: 'SettingsSection' }],
  rules: [
    'It takes sections, the same shape as a settings file, and preview, the sample.',
    'It reads and writes the app settings, with the per-section reset against the app defaults.',
    'A row with the wide layout, such as the custom pattern editor, fills the width of the settings column.',
  ],
  a11y: ['Rows keep their labels, descriptions and hints; the preview is a labelled region.'],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'SettingsSplit lets the user edit settings while a sample shows the result.',
  },
  example: `import { SettingsSplit } from '../SettingsSplit';

const Page = () => <SettingsSplit sections={[]} preview={<p>Sample</p>} />;
`,
  propsHash: '53ce7b53cc9d479f',
} satisfies ComponentUsage;

export { usage };
