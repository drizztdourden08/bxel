/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Names where the canvas draws: the open animation, the frame and the sprite behind it. It warns when the sprite is shared with other animations or sheets, and when only a cell of it can be drawn on.',
  useWhen: ['An animation tab is open and a frame is picked in the timeline.'],
  avoidWhen: [
    { case: 'A message only informs and offers nothing.', use: 'Toast' },
    { case: 'Sprites that became animations need saving.', use: 'LegacyBar' },
  ],
  rules: [
    'The bar reads the active animation and takes no props.',
    'Open sprite shows only for a sprite that is a file of its own. A sprite owned by the animation is edited in place.',
    'Make a copy for this animation gives the picked frame a sprite of its own, so the shared sprite stays as it is.',
  ],
  a11y: ['The path is a navigation landmark with a list of three steps.', 'Both buttons are in tab order after the path.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'FrameBar is the breadcrumb of the frame being edited, with the notes about a shared sprite and a clip.',
  },
  example: `import { FrameBar } from '../FrameBar';

const EditorHeader = () => <FrameBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
