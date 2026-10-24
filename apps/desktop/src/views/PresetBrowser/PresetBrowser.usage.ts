/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the platform presets that ship with Bxel, by family, with the rules of each one. It is read only.',
  useWhen: ['The App settings show which platforms Bxel knows and what each asks for.'],
  avoidWhen: [{ case: 'The owner picks a platform for a project or a sprite.', use: 'AssetControl' }],
  rules: ['It takes no props and changes nothing.', 'Each preset shows its slots, its slot 0 rule, its palette count and its starting size.'],
  a11y: ['Each family is a labelled group of plain text lines.'],
  tree: {
    path: ['a status, a count or a label', 'the state something is in'],
    rule: 'PresetBrowser shows the rules of each platform preset as plain text.',
  },
  example: `import { PresetBrowser } from '../PresetBrowser';

const PresetsPage = () => <PresetBrowser />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
