/* @layer renderer-app @kind types */
import type { AnimStep, Animation } from '@bxel/document';
import type { AnimationStrip } from './tool-input.type';

type DrawnAnimation = {
  readonly animation: Animation;
  readonly steps: readonly AnimStep[];
  readonly strip: AnimationStrip;
};

export type { DrawnAnimation };
