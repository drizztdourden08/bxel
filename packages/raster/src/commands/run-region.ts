/* @layer core @kind logic */
import { addWarning } from '@bxel/document';
import type { CommandInput, Draft } from '@bxel/document';
import type { MaskView } from '../buffer.type';
import type { Orientation } from '../transform/transform.type';
import { transformRegion } from '../transform/transform-region';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { PIXELS_CLIPPED } from './transform-commands.constants';
import { uniqueCels } from './unique-cels';

const runRegion = (draft: Draft, input: CommandInput<{ readonly mask: MaskView }>, orientation: Orientation): void => {
  const { mask } = input.options;
  checkTargets({ project: draft.project, sprites: input.sprites, index: 0, mask });
  let clipped = 0;
  applyToCels(draft, uniqueCels(input.cels), (target) => {
    const result = transformRegion({ target, mask, orientation });
    clipped = Math.max(clipped, result.clipped);
    return result.rect;
  });
  if (clipped > 0) {
    addWarning(draft, PIXELS_CLIPPED, `${clipped} masked pixel(s) moved outside the sprite and were dropped.`);
  }
};

export { runRegion };
