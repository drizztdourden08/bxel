/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { ADVANCED_COMMAND, TRANSFORM_COMMAND } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { CommitStep } from '../commit-request.type';
import type { EditorTarget } from '../editor.type';
import type { PendingEdit } from './pending.type';
import type { SpecOf } from './pending-step.type';
import { clipRect } from './clip-rect';
import { regionBox } from './region-box';

const maskPart = (mask: MaskView | null): { mask?: MaskView } => (mask ? { mask } : {});

const flipStep = (spec: SpecOf<'flip'>, mask: MaskView | null): CommitStep =>
  mask
    ? { name: TRANSFORM_COMMAND.pixelsFlip, options: { axis: spec.axis, mask } }
    : { name: TRANSFORM_COMMAND.spriteFlip, options: { axis: spec.axis } };

const turnStep = (spec: SpecOf<'turn'>, mask: MaskView | null): CommitStep =>
  mask
    ? { name: TRANSFORM_COMMAND.pixelsTurn, options: { direction: spec.direction, mask } }
    : { name: TRANSFORM_COMMAND.spriteTurn, options: { direction: spec.direction } };

const rotateStep = (target: EditorTarget, spec: SpecOf<'rotate'>, mask: MaskView | null): CommitStep => {
  const box = regionBox(target, mask);
  const pivot = { x2: 2 * box.x + box.width, y2: 2 * box.y + box.height };
  return {
    name: ADVANCED_COMMAND.pixelsRotate,
    options: { angle: spec.angle, pivot, bounds: spec.bounds, skipZero: false, ...maskPart(mask) },
  };
};

const scaleStep = (spec: SpecOf<'scale'>, mask: MaskView | null): CommitStep => ({
  name: ADVANCED_COMMAND.pixelsScale,
  options: {
    target: { by: 'size', width: spec.width, height: spec.height },
    anchor: 'center',
    bounds: spec.bounds,
    skipZero: false,
    ...maskPart(mask),
  },
});

const pendingStep = (target: EditorTarget, pending: PendingEdit): CommitStep => {
  const { spec, mask } = pending;
  switch (spec.kind) {
    case 'flip':
      return flipStep(spec, mask);
    case 'turn':
      return turnStep(spec, mask);
    case 'rotate':
      return rotateStep(target, spec, mask);
    case 'scale':
      return scaleStep(spec, mask);
    case 'move':
      return { name: ADVANCED_COMMAND.pixelsMove, options: { offset: spec.offset, skipZero: false, ...maskPart(mask) } };
    case 'paste':
      return {
        name: COMMAND_NAME.pixelsPatch,
        options: { rect: clipRect(spec.clip, spec.offset), pixels: spec.clip.pixels, skipZero: true },
      };
  }
};

export { pendingStep };
