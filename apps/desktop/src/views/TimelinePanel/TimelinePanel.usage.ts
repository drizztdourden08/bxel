/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the frames of the open sprite across and its layers down, with a cel at each crossing, and lets the user play the animation, pick and move frames and cels, set durations, mark tags and turn onion skin on.',
  useWhen: [
    'The editor docks a panel at the bottom where the user chooses the frame that drawing goes to.',
    'Frames must be added, copied, deleted, moved or timed, or cels must be linked, unlinked, cleared or moved.',
  ],
  avoidWhen: [
    { case: 'The user picks the layer that drawing goes to and shows, locks or orders layers.', use: 'LayersPanel' },
    { case: 'The user picks and orders the sprites of a file instead of the frames of one sprite.', use: 'SpritesPanel' },
  ],
  rules: [
    'The panel reads the active document and the timeline store, so it takes no props.',
    'Every change to frames, tags or cels is one command of the document engine, so each is one undo step.',
    'Playback, the picked frame, the picked cels and the onion skin settings are view state: they never change the document.',
    'A refused command shows the reason in plain words and changes nothing.',
  ],
  a11y: [
    'The grid is named Frames and layers, and each cel is a button named by its layer, frame and state.',
    'Enter or Space plays and pauses, comma and period step by one frame, and the arrows move the picked cel.',
    'Alt with Left or Right moves the picked frames; Alt and Shift with an arrow moves the picked cels.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'TimelinePanel is the frame grid and playback bar of the open sprite, filled from the document and the timeline store.',
  },
  example: `import { TimelinePanel } from '../TimelinePanel';

const TimelineDock = () => <TimelinePanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
