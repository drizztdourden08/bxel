/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { ADVANCED_COMMAND, TRANSFORM_COMMAND } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { CommitStep } from '../commit-request.type';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import type { SpecOf } from './pending-step.type';
import { clipRect } from './clip-rect';
import { lockPastePixels } from './lock-paste-pixels';

const maskPart = (mask: MaskView | null): { mask?: MaskView } => (mask ? { mask } : {});

const flipStep = (spec: SpecOf<'flip'>, mask: MaskView | null): CommitStep =>
  mask
    ? { name: TRANSFORM_COMMAND.pixelsFlip, options: { axis: spec.axis, mask } }
    : { name: TRANSFORM_COMMAND.spriteFlip, options: { axis: spec.axis } };

const turnStep = (spec: SpecOf<'turn'>, mask: MaskView | null): CommitStep =>
  mask
    ? { name: TRANSFORM_COMMAND.pixelsTurn, options: { direction: spec.direction, mask } }
    : { name: TRANSFORM_COMMAND.spriteTurn, options: { direction: spec.direction } };

const transformStep = (spec: SpecOf<'transform'>, mask: MaskView | null): CommitStep => {
  const shared = { algorithm: spec.algorithm, bounds: spec.bounds, skipZero: false, ...maskPart(mask) };
  if (spec.corners) return { name: ADVANCED_COMMAND.pixelsDistort, options: { corners: spec.corners, ...shared } };
  const pivot = spec.pivot ? { pivot: spec.pivot } : {};
  return {
    name: ADVANCED_COMMAND.pixelsTransform,
    options: { scale: spec.scale, angle: spec.angle, skew: spec.skew, offset: spec.offset, ...pivot, ...shared },
  };
};

const pasteStep = (target: EditorTarget, spec: SpecOf<'paste'>): CommitStep => {
  const rect = clipRect(spec.clip, spec.offset);
  const limit = target.animation?.frame.clip ?? null;
  return { name: COMMAND_NAME.pixelsPatch, options: { rect, pixels: lockPastePixels(rect, spec.clip.pixels, limit), skipZero: true } };
};

const pendingStep = (target: EditorTarget, pending: PendingEdit): CommitStep => {
  const { spec, mask } = pending;
  switch (spec.kind) {
    case 'flip':
      return flipStep(spec, mask);
    case 'turn':
      return turnStep(spec, mask);
    case 'transform':
      return transformStep(spec, mask);
    case 'move':
      return { name: ADVANCED_COMMAND.pixelsMove, options: { offset: spec.offset, skipZero: false, ...maskPart(mask) } };
    case 'paste':
      return pasteStep(target, spec);
  }
};

export { pendingStep };
