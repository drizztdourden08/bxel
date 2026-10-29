/* @layer renderer-app @kind types */
import type { GuideLines } from './guide.type';

interface SnapRequest {
  readonly lines: GuideLines | undefined;
  readonly zoom: number;
  readonly from: { x: number; y: number } | null;
}

export type { SnapRequest };
