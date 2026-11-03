/* @layer renderer-app @kind constants */
import type { AnimDirection } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import type { PixelPlayerDirection, RgbaImage as PlayerImage } from '@drizztdourden08/tessera';
import type { PreviewTag } from '../asset-overview/asset-overview.type';
import type { PlaybackLoop } from './asset-preview.type';

const NO_TAGS: readonly PreviewTag[] = [];

const DEFAULT_LOOP: PlaybackLoop = { direction: 'forward', repeat: 0 };

const PLAYER_DIRECTION: Readonly<Record<AnimDirection, PixelPlayerDirection>> = {
  forward: 'forward',
  reverse: 'reverse',
  pingpong: 'pingpong',
  pingpongReverse: 'pingpong',
};

const PLAYER_IMAGES = new WeakMap<RgbaImage, PlayerImage>();

const PREVIEW_TEXT = {
  none: 'Nothing to show yet.',
  swatches: (count: number): string => `${count} colours`,
  slot: (at: number, name: string, rgb: string): string => `Slot ${at}, ${name}, ${rgb}`,
  transparentSlot: (at: number): string => `Slot ${at}, transparent`,
} as const;

export { DEFAULT_LOOP, NO_TAGS, PLAYER_DIRECTION, PLAYER_IMAGES, PREVIEW_TEXT };
