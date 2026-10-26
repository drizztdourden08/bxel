/* @layer renderer-app @kind types */
import type { FramePng } from './tool-input.type';

type ExportedAnimation = {
  readonly file: FramePng;
  readonly hash: string;
};

export type { ExportedAnimation };
