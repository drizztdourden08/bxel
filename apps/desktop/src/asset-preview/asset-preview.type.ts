/* @layer renderer-app @kind types */
import type { AnimDirection } from '@bxel/document';
import type { PreviewFrame } from '../asset-overview/asset-overview.type';

type PlaybackLoop = { readonly direction: AnimDirection; readonly repeat: number };

type PlaybackSpeed = '0.5' | '1' | '2';

type PlaybackModel = {
  readonly index: number;
  readonly shown: number;
  readonly playing: boolean;
  readonly speed: PlaybackSpeed;
  readonly finished: boolean;
  readonly play: () => void;
  readonly pause: () => void;
  readonly step: (by: number) => void;
  readonly setSpeed: (speed: PlaybackSpeed) => void;
};

type PlaybackInput = {
  readonly frames: readonly PreviewFrame[];
  readonly loop: PlaybackLoop;
};

type PreviewMode = 'compact' | 'large';

export type { PlaybackInput, PlaybackLoop, PlaybackModel, PlaybackSpeed, PreviewMode };
