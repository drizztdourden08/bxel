/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Sets how a strip sprite is cut into cells, by count or by cell size, and whether the frames use the cells or become sprites of their own, and says how many frames it makes.',
  useWhen: [
    'A dialog adds frames from a strip or turns a strip into an animation.',
    'The same grid fields are needed in more than one dialog.',
  ],
  avoidWhen: [
    { case: 'A sprite is sliced into new sprites with names.', use: 'RadioGroup' },
    { case: 'Only one number is needed.', use: 'NumberInput' },
  ],
  rules: [
    'Pass the grid, the plan from the document and the result choice, and receive each change in its callbacks.',
    'A plan with an error shows the reason and no frame count.',
    'Cells run left to right, then top to bottom.',
  ],
  a11y: [
    'Every control sits in a labelled Field or radio group.',
    'The frame count is announced politely and an error is a callout.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'StripFields groups the grid, the result and the cell count of a strip cut.',
  },
  example: `import { StripFields } from '../StripFields';
import type { ComponentProps } from 'react';

const Fields = (props: ComponentProps<typeof StripFields>) => <StripFields {...props} />;
`,
  propsHash: '3d8cbd1a73564cc0',
} satisfies ComponentUsage;

export { usage };
