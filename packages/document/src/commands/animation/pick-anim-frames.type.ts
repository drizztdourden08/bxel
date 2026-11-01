/* @layer core @kind types */
import type { AnimFrameRef } from '../../schema/animation-options.type';

interface FrameChoice {
  readonly frame?: AnimFrameRef | undefined;
  readonly frames?: readonly AnimFrameRef[] | undefined;
}

export type { FrameChoice };
