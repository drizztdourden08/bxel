/* @layer renderer-app @kind constants */
import type { OnionTint } from '../stores/timeline-store.type';
import type { OnionSide, Rgb } from './onion.type';

const ONION_TINTS: Readonly<Record<OnionSide, Rgb>> = {
  before: [224, 72, 72],
  after: [72, 128, 232],
};

const ONION_TEXT = {
  toggle: 'Onion skin',
  before: 'Frames before',
  after: 'Frames after',
  opacity: 'Onion opacity',
  tint: 'Onion tint',
  tints: { none: 'None', split: 'Red and blue', grey: 'Grey' },
} as const;

const ONION_TINT_ORDER: readonly OnionTint[] = ['split', 'grey', 'none'];

const GREY_WEIGHTS: Rgb = [0.299, 0.587, 0.114];

export { GREY_WEIGHTS, ONION_TEXT, ONION_TINT_ORDER, ONION_TINTS };
