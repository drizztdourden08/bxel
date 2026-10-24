/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws one Bxel pixel art icon by name, in the current text colour, so tools and options look like the art they edit.',
  useWhen: [
    'A tool button, menu item or option needs an icon that Tessera does not have, such as the pencil, the eraser or the magic wand.',
    'The icon must stay crisp at a whole number of pixels and follow the theme colour.',
  ],
  avoidWhen: [{ case: 'The icon is one of the Tessera set, such as a chevron or a close mark.', use: 'Icon' }],
  rules: [
    'Pass a name from the pixel icon set; the sixteen by sixteen grid is drawn without smoothing in one solid tone and one soft tone.',
    'Keep the size at sixteen or a whole multiple of it, so every art pixel stays a whole number of screen pixels.',
    'Put it inside an IconButton or a menu item, which carries the accessible name; give it a label only when it stands alone.',
  ],
  a11y: [
    'Without a label the icon is hidden from screen readers, so the control around it must have a name.',
    'With a label the icon is an image with that name.',
  ],
  tree: {
    path: ['icons and brand', 'an icon from your own path'],
    rule: 'PixelIcon is the app icon drawn from its own pixel data, passed to the Tessera Icon as icon data.',
  },
  example: `import { IconButton } from '@drizztdourden08/tessera';
import { PixelIcon } from '../PixelIcon';

const PencilButton = () => (
  <IconButton label="Pencil">
    <PixelIcon name="pencil" />
  </IconButton>
);
`,
  propsHash: 'a90563ee7294e4e9',
} satisfies ComponentUsage;

export { usage };
