/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Sets whether sprites join an animation as they are or as copies, and how long each new frame lasts.',
  useWhen: [
    'A dialog adds frames or makes an animation from sprites.',
    'The same two fields are needed in more than one dialog.',
  ],
  avoidWhen: [
    { case: 'Only one number is needed.', use: 'NumberInput' },
    { case: 'The frames of an existing animation change their time.', use: 'NumberInput' },
  ],
  rules: [
    'Pass the mode and the duration, and receive each change in its own callback.',
    'Pass null as the mode to hide the choice and keep only the duration.',
    'The duration runs from the smallest to the largest frame time the animation allows.',
  ],
  a11y: [
    'The mode is a labelled radio group with a description for each choice.',
    'The duration sits in a labelled Field.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'FrameModeFields shows the use mode and the frame time of new frames side by side.',
  },
  example: `import { FrameModeFields } from '../FrameModeFields';

const Fields = () => <FrameModeFields mode="reference" durationMs={100} onMode={() => undefined} onDuration={() => undefined} />;
`,
  propsHash: '21f39c22fc255ab9',
} satisfies ComponentUsage;

export { usage };
