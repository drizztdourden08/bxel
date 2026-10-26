/* @layer renderer-app @kind types */
import type { AnimFacing } from '@bxel/document';

type DirectionMode = 'four' | 'eight';

interface DirectionSetSpec {
  mode: DirectionMode;
  tag: string;
  framesPerFacing: number;
  mirrored: readonly AnimFacing[];
  durationMs: number;
}

interface MirrorPair {
  mirrored: AnimFacing;
  source: AnimFacing;
}

interface DirectionSetState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export type { DirectionMode, DirectionSetSpec, DirectionSetState, MirrorPair };
