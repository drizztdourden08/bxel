/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the frames of the open animation in a strip with their tags, and lets the user play it, pick, move, copy and delete frames, set durations, offsets and pivots, mark tags and turn onion skin on.',
  useWhen: [
    'The editor docks a panel at the bottom where the user chooses the frame that drawing goes to.',
    'Frames must be added, copied, deleted, moved or timed, or tags and facings must be edited.',
  ],
  avoidWhen: [
    { case: 'The user picks the layer that drawing goes to and shows, locks or orders layers.', use: 'LayerStack' },
    { case: 'The user picks and orders the sprites of a file instead of the frames of one animation.', use: 'SpritesPanel' },
  ],
  rules: [
    'The panel reads the active animation tab and the timeline store, so it takes no props.',
    'On a sprite tab it offers to make an animation from the sprite or to open one; a sprite has no frames.',
    'Every change to frames or tags is one command of the document engine, so each is one undo step.',
    'Playback, the picked frames, the picked tag and the onion skin settings are view state: they never change the document.',
    'A refused command shows the reason in plain words and changes nothing.',
  ],
  a11y: [
    'The strip is a list named Frames, and each frame is a button named by its number, time and badges.',
    'Comma and period step by one frame, Left and Right pick the neighbour, and Home and End pick the ends.',
    'Alt with Left or Right moves the picked frames.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'TimelinePanel is the frame strip and playback bar of the open animation, filled from the document and the timeline store.',
  },
  example: `import { TimelinePanel } from '../TimelinePanel';

const TimelineDock = () => <TimelinePanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
