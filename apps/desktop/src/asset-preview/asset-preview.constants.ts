/* @layer renderer-app @kind constants */
import type { AnimDirection } from '@bxel/document';
import type { PlaybackLoop, PlaybackSpeed } from './asset-preview.type';

const SPEEDS: readonly PlaybackSpeed[] = ['0.5', '1', '2'];

const MIN_FRAME_MS = 20;

const DEFAULT_LOOP: PlaybackLoop = { direction: 'forward', repeat: 0 };

const LOOP_LABEL: Readonly<Record<AnimDirection, string>> = {
  forward: 'Forward',
  reverse: 'Reverse',
  pingpong: 'Ping-pong',
  pingpongReverse: 'Reverse ping-pong',
};

const PREVIEW_TEXT = {
  play: 'Play',
  pause: 'Pause',
  replay: 'Play again',
  stepBack: 'Previous frame',
  stepForward: 'Next frame',
  speed: 'Speed',
  speedLabel: (speed: PlaybackSpeed): string => `${speed}x`,
  frame: (at: number, total: number): string => `Frame ${at} of ${total}`,
  loop: (loop: PlaybackLoop): string => `${LOOP_LABEL[loop.direction]}, ${loop.repeat === 0 ? 'repeats forever' : `plays ${loop.repeat} ${loop.repeat === 1 ? 'time' : 'times'}`}`,
  none: 'Nothing to show yet.',
  controls: 'Animation controls',
  swatches: (count: number): string => `${count} colours`,
  slot: (at: number, name: string, rgb: string): string => `Slot ${at}, ${name}, ${rgb}`,
  transparentSlot: (at: number): string => `Slot ${at}, transparent`,
  zoom: (zoom: number): string => `${zoom}x`,
} as const;

export { DEFAULT_LOOP, LOOP_LABEL, MIN_FRAME_MS, PREVIEW_TEXT, SPEEDS };
