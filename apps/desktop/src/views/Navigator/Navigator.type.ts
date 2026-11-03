/* @layer renderer-app @kind types */
import type { NavigatorAxisStep } from '@drizztdourden08/tessera';

interface ThumbSize {
  width: number;
  height: number;
  scale: number;
}

interface ThumbBox {
  width: number;
  height: number;
}

interface ImageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface NavigatorFacts extends ImageRect {
  imageWidth: number;
  imageHeight: number;
  said: string;
  percent: number;
}

interface VisibleSize {
  width: number;
  height: number;
}

interface KeySteps {
  step: NavigatorAxisStep;
  bigStep: NavigatorAxisStep;
}

export type { ImageRect, KeySteps, NavigatorFacts, ThumbBox, ThumbSize, VisibleSize };
