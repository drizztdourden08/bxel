/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import { FIT_LIMITS, ONION_LIMITS } from '../stores/timeline-store.constants';
import { ONION_TEXT } from './onion.constants';

const choice = (labels: Readonly<Record<string, string>>): { value: string; label: string }[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const ANIMATION_SECTIONS: Section[] = [
  {
    id: 'playback',
    title: 'Playback',
    items: [
      {
        key: 'animPlayMode',
        label: 'Play mode',
        description: 'How the timeline plays its range.',
        hint: 'Loop repeats, Play once stops at the end, Ping-pong plays out and back.',
        control: { kind: 'choice', options: [{ value: 'loop', label: 'Loop' }, { value: 'once', label: 'Play once' }, { value: 'pingpong', label: 'Ping-pong' }] },
      },
      {
        key: 'animSubtags',
        label: 'Play subtags and repeats',
        description: 'A whole animation plays each tag in its own mode and repeats it.',
        hint: 'Off, a tag plays as one pass. A preview only; the file is never changed.',
      },
      {
        key: 'animRewind',
        label: 'Rewind on stop',
        description: 'Pausing returns the playhead to the frame where playing began.',
      },
    ],
  },
  {
    id: 'strip',
    title: 'Frame strip',
    items: [
      {
        key: 'animThumb',
        label: 'Default thumbnail size',
        description: 'The size of a frame thumbnail in an animation that has none saved.',
        hint: 'Each animation remembers the size you set on its own timeline.',
        control: { kind: 'number', min: FIT_LIMITS.min, max: FIT_LIMITS.max, step: 8, unit: 'px' },
      },
    ],
  },
  {
    id: 'onion',
    title: 'Onion skin',
    items: [
      {
        key: 'animOnionBefore',
        label: ONION_TEXT.before,
        description: 'How many frames before the current one show as ghosts.',
        control: { kind: 'number', min: ONION_LIMITS.frames.min, max: ONION_LIMITS.frames.max, step: 1 },
      },
      {
        key: 'animOnionAfter',
        label: ONION_TEXT.after,
        description: 'How many frames after the current one show as ghosts.',
        control: { kind: 'number', min: ONION_LIMITS.frames.min, max: ONION_LIMITS.frames.max, step: 1 },
      },
      {
        key: 'animOnionOpacity',
        label: ONION_TEXT.opacity,
        description: 'How solid the nearest ghost is.',
        control: { kind: 'number', min: ONION_LIMITS.opacity.min, max: ONION_LIMITS.opacity.max, step: 5, unit: '%' },
      },
      { key: 'animOnionFalloff', label: ONION_TEXT.falloff, description: 'Whether farther ghosts fade.', control: { kind: 'choice', options: choice(ONION_TEXT.falloffs) } },
      { key: 'animOnionTint', label: ONION_TEXT.tint, description: 'Tint ghosts, draw them grey or in their own colours.', control: { kind: 'choice', options: choice(ONION_TEXT.tints) } },
      { key: 'animOnionBeforeColour', label: ONION_TEXT.beforeColour, description: 'The tint of ghosts before the frame.', control: { kind: 'color' } },
      { key: 'animOnionAfterColour', label: ONION_TEXT.afterColour, description: 'The tint of ghosts after the frame.', control: { kind: 'color' } },
      {
        key: 'animOnionStyle',
        label: ONION_TEXT.style,
        description: 'Filled ghosts or only their edge pixels.',
        hint: 'Outline stays readable at a high opacity.',
        control: { kind: 'choice', options: choice(ONION_TEXT.styles) },
      },
      { key: 'animOnionOrder', label: ONION_TEXT.order, description: 'Which frames count as before and after.', control: { kind: 'choice', options: choice(ONION_TEXT.orders) } },
      { key: 'animOnionWrap', label: ONION_TEXT.wrap, description: 'Frame 1 of a looping range ghosts the last frame before it.', hint: 'Off while the play mode is Play once.' },
      { key: 'animOnionScope', label: ONION_TEXT.scope, description: 'Ghost only the frames of the range, or the whole animation.', control: { kind: 'choice', options: choice(ONION_TEXT.scopes) } },
      { key: 'animOnionSkipRepeats', label: ONION_TEXT.skipRepeats, description: 'Leave out ghosts that show the same sprite as the current frame.' },
      { key: 'animOnionPosition', label: ONION_TEXT.position, description: 'Draw ghosts behind the frame or over it.', control: { kind: 'choice', options: choice(ONION_TEXT.positions) } },
      { key: 'animOnionHideWhilePlaying', label: ONION_TEXT.hide, description: 'No ghosts while the animation plays.' },
    ],
  },
];

export { ANIMATION_SECTIONS };
