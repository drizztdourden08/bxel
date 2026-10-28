/* @layer renderer-app @kind types */
import type { GuideAxis } from '../guides/guide.type';

interface ViewGuides {
  readonly x: readonly number[];
  readonly y: readonly number[];
}

interface SurfaceGuideState {
  guides: Readonly<Record<string, ViewGuides>>;
  add: (key: string, axis: GuideAxis, position: number) => void;
  move: (key: string, axis: GuideAxis, from: number, to: number) => void;
  remove: (key: string, axis: GuideAxis, position: number) => void;
  clear: (key: string) => void;
}

export type { SurfaceGuideState, ViewGuides };
