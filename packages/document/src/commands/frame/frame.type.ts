/* @layer core @kind types */
import type { Frame, Sprite } from '../../model/sprite.type';
import type { FrameRef } from '../../schema/command-options.type';

type PickedFrame = {
  readonly sprite: Sprite;
  readonly frame: Frame;
  readonly index: number;
};

type FrameSpec = {
  readonly after: FrameRef | undefined;
  readonly copyOf: FrameRef | undefined;
  readonly durationMs: number | undefined;
  readonly linked: boolean;
};

export type { FrameSpec, PickedFrame };
