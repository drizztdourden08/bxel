/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { showForKind } from '../../asset-config/show-for-kind';

const meta: ScreenMeta = {
  title: 'Animation',
  icon: 'image',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('animation'),
  keywords: ['animation', 'name', 'canvas', 'size', 'width', 'height', 'anchor', 'loop', 'repeat', 'direction', 'frames', 'export'],
};

const directions = [
  { value: 'forward', label: 'Forward', hint: 'Plays the frames from first to last.' },
  { value: 'reverse', label: 'Reverse', hint: 'Plays the frames from last to first.' },
  { value: 'pingpong', label: 'Ping-pong', hint: 'Plays forward, then back, without repeating the end frames.' },
  { value: 'pingpongReverse', label: 'Reverse ping-pong', hint: 'Plays back, then forward, without repeating the end frames.' },
];

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'animation.name', label: 'Name', description: 'The name of the animation and of its file.', hint: 'The file takes the name when you save.', control: { kind: 'text', placeholder: 'Animation name' } },
      {
        key: 'animation.width',
        label: 'Canvas width',
        description: 'Pixels across the area every frame is placed in.',
        hint: 'The canvas is the frame of the animation. Sprites are placed on it by the anchor and the pivot of each frame.',
        control: { kind: 'number', min: 1, step: 1, unit: 'px' },
      },
      { key: 'animation.height', label: 'Canvas height', description: 'Pixels down the area every frame is placed in.', control: { kind: 'number', min: 1, step: 1, unit: 'px' } },
      {
        key: 'animation.anchorX',
        label: 'Anchor across',
        description: 'Where the pivots of the frames land, from the left edge of the canvas.',
        hint: 'Half pixels are allowed.',
        control: { kind: 'number', min: 0, step: 0.5, unit: 'px' },
      },
      { key: 'animation.anchorY', label: 'Anchor down', description: 'Where the pivots of the frames land, from the top edge of the canvas.', control: { kind: 'number', min: 0, step: 0.5, unit: 'px' } },
    ],
  },
  {
    id: 'playback',
    title: 'Playback',
    items: [
      {
        key: 'animation.loopDirection',
        label: 'Loop mode',
        description: 'How the whole animation plays when no tag is picked.',
        hint: 'A tag has a loop mode of its own.',
        control: { kind: 'choice', options: directions },
      },
      {
        key: 'animation.loopRepeat',
        label: 'Repeat',
        description: 'How many times the animation plays. 0 plays it forever.',
        control: { kind: 'number', min: 0, max: 255, step: 1 },
      },
    ],
  },
];

export default sections;
export { meta };
