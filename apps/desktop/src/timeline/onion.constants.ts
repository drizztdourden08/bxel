/* @layer renderer-app @kind constants */
import type { OnionFalloff, OnionOrder, OnionPosition, OnionScope, OnionStyle, OnionTint } from '../stores/timeline-store.type';
import type { Rgb } from './onion.type';

const ONION_TEXT = {
  toggle: 'Onion skin',
  settings: 'Onion skin settings',
  before: 'Frames before',
  after: 'Frames after',
  opacity: 'Nearest opacity',
  falloff: 'Falloff',
  tint: 'Colour',
  beforeColour: 'Before colour',
  afterColour: 'After colour',
  style: 'Style',
  order: 'Order',
  wrap: 'Wrap at the loop ends',
  scope: 'Scope',
  skipRepeats: 'Skip repeated sprites',
  position: 'Draw',
  hide: 'Hide while playing',
  strip: 'Ghost strip',
  more: 'More options',
  tints: { none: 'Original', split: 'Tints', grey: 'Grey' } as Readonly<Record<OnionTint, string>>,
  falloffs: { linear: 'Linear', flat: 'Flat' } as Readonly<Record<OnionFalloff, string>>,
  styles: { filled: 'Filled', outline: 'Outline' } as Readonly<Record<OnionStyle, string>>,
  orders: { play: 'Play order', strip: 'Strip order' } as Readonly<Record<OnionOrder, string>>,
  scopes: { range: 'Inside the range', all: 'Whole animation' } as Readonly<Record<OnionScope, string>>,
  positions: { behind: 'Behind the frame', front: 'In front' } as Readonly<Record<OnionPosition, string>>,
} as const;

const ONION_TINT_ORDER: readonly OnionTint[] = ['split', 'grey', 'none'];

const ONION_FALLOFF_ORDER: readonly OnionFalloff[] = ['linear', 'flat'];

const ONION_STYLE_ORDER: readonly OnionStyle[] = ['filled', 'outline'];

const ONION_ORDER_ORDER: readonly OnionOrder[] = ['play', 'strip'];

const ONION_SCOPE_ORDER: readonly OnionScope[] = ['range', 'all'];

const ONION_POSITION_ORDER: readonly OnionPosition[] = ['behind', 'front'];

const GREY_WEIGHTS: Rgb = [0.299, 0.587, 0.114];

export { GREY_WEIGHTS, ONION_FALLOFF_ORDER, ONION_ORDER_ORDER, ONION_POSITION_ORDER, ONION_SCOPE_ORDER, ONION_STYLE_ORDER, ONION_TEXT, ONION_TINT_ORDER };
