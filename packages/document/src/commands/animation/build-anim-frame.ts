/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { AnimFrame } from '../../model/animation.type';
import type { AnimFrameId } from '../../model/ids.type';
import { DEFAULT_FRAME_DURATION_MS } from '../../model/limits.constants';
import { NO_OFFSET } from './animation.constants';
import type { FrameFields, FrameTarget } from './build-anim-frame.type';

const buildAnimFrame = (ids: IdSource, target: FrameTarget, fields: FrameFields = {}): AnimFrame => ({
  id: ids.next('afr') as AnimFrameId,
  spriteId: target.spriteId,
  clip: target.clip ?? null,
  durationMs: fields.durationMs ?? DEFAULT_FRAME_DURATION_MS,
  offset: fields.offset ?? NO_OFFSET,
  pivot: fields.pivot ?? null,
});

export { buildAnimFrame };
