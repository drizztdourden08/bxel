/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows one platform preset that ships with Bxel at a time: its rules and notes beside a preview with its palette and sample sprites at its sizes. It is read only.',
  useWhen: ['The App settings show which platforms Bxel knows and what each asks for.'],
  avoidWhen: [{ case: 'The owner picks a platform for a project or a sprite.', use: 'AssetControl' }],
  rules: [
    'It takes no props and changes nothing.',
    'A searchable picker chooses the preset, named by family.',
    'The details show the kind, the colour count, the palettes, slot 0, the tile size, the sprite sizes, the new sprite size and the area rules, then the notes.',
    'The preview shows the palette and a sample sprite at each size the preset allows, with the tile grid over it. The preview sits in the preview column of the Brock settings layout: beside the details when the page is wide, above them when it is narrow.',
  ],
  a11y: ['The details are a labelled group of text rows; the palette and each sample are labelled images.'],
  tree: {
    path: ['a status, a count or a label', 'the state something is in'],
    rule: 'PresetBrowser shows the rules of a platform preset as text with a picture of its palette and sizes.',
  },
  example: `import { PresetBrowser } from '../PresetBrowser';

const PresetsPage = () => <PresetBrowser />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
