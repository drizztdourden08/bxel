/* @layer core @kind logic */
import type { CommandInput, Draft } from '@bxel/document';
import { paintStroke } from '../paint-stroke';
import { applyInked } from './apply-inked';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import { resolveBrush } from './resolve-brush';
import { withInkIndex } from './ink-indexes';
import type { PixelsEraseOptions } from './schema/pixels-options.type';

const runStroke = (draft: Draft, input: CommandInput<PixelsEraseOptions>, index: number): void => {
  const { points, brush, pixelPerfect, symmetry, mask, wrap, ink } = input.options;
  checkPointCount(points.length, input.step);
  checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: withInkIndex(index, ink), mask });
  applyInked({ draft, cels: input.cels, ink }, (target, rule) =>
    paintStroke({ target, index, mask, wrap, points, brush: resolveBrush(draft.artwork, brush), pixelPerfect, symmetry, ink: rule }),
  );
};

export { runStroke };
