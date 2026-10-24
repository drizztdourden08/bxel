/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A segmented control whose every option explains itself in a hint with its name, a one line description and its keys.',
  useWhen: [
    'A tool option is one choice from a short list, such as the brush shape, the fill area or the selection mode.',
    'Each choice needs a sentence of its own that the user can read before picking it.',
  ],
  avoidWhen: [
    { case: 'The choices need no explanation.', use: 'SegmentedControl' },
    { case: 'Several choices can be on at once.', use: 'ToggleGroup' },
  ],
  rules: [
    'Pass the value, the options and the change handler. Each option carries its value, its label and its hint.',
    'The hint opens under the whole control and follows the option the pointer or the focus is on.',
    'An option can be off with a reason in words, which shows as the reason of the option.',
  ],
  a11y: [
    'The control is a radio group named by label and each segment is a radio.',
    'The hint is a tooltip linked to the control, so the description is read with it.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'HintedSegments is the SegmentedControl of the editor options: every option says what it does.',
  },
  example: `import { HintedSegments } from '../HintedSegments';

const ShapeChoice = ({ shape, onChange }: { shape: 'square' | 'circle'; onChange: (shape: 'square' | 'circle') => void }) => (
  <HintedSegments
    label="Brush shape"
    value={shape}
    onChange={onChange}
    options={[
      { value: 'square', label: 'Square', hint: { name: 'Square', description: 'Paint with a square brush tip.' } },
      { value: 'circle', label: 'Circle', hint: { name: 'Circle', description: 'Paint with a round brush tip.' } },
    ]}
  />
);
`,
  propsHash: '210b296069a4e3ae',
} satisfies ComponentUsage;

export { usage };
