/* @layer core @kind constants */
import type { OnionState } from './onion-state.type';

const ONION_DEFAULTS: OnionState = {
  on: false,
  before: 1,
  after: 1,
  opacity: 40,
  falloff: 'linear',
  tint: 'split',
  beforeColour: '#e04848',
  afterColour: '#4880e8',
  style: 'filled',
  order: 'play',
  wrap: true,
  scope: 'range',
  skipRepeats: false,
  position: 'behind',
  hideWhilePlaying: true,
};

export { ONION_DEFAULTS };
