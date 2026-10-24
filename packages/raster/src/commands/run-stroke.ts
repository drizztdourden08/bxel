/* @layer core @kind logic */
import type { CommandInput, Draft } from '@bxel/document';
import { paintStroke } from '../paint-stroke';
import { applyToCels } from './apply-to-cels';
import { checkPointCount } from './check-point-count';
import { checkTargets } from './check-targets';
import type { PixelsEraseOptions } from './schema/pixels-options.type';

const runStroke = (draft: Draft, input: CommandInput<PixelsEraseOptions>, index: number): void => {
  const { points, brush, pixelPerfect, symmetry, mask } = input.options;
  checkPointCount(points.length, input.step);
  checkTargets({ artwork: draft.artwork, sprites: input.sprites, index, mask });
  applyToCels(draft, input.cels, (target) =>
    paintStroke({ target, index, mask, points, brush, pixelPerfect, symmetry }),
  );
};

export { runStroke };
