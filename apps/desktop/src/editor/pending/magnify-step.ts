/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { CommitStep } from '../commit-request.type';
import { magnifyChoices } from '../transform/magnify-choices';
import { magnifyFactor } from '../transform/magnify-factor';
import type { SpecOf } from './pending-step.type';

const magnifyStep = (spec: SpecOf<'transform'>, mask: MaskView | null): CommitStep | null => {
  const factor = magnifyFactor(spec);
  if (factor === null || !magnifyChoices(spec).includes(spec.algorithm)) return null;
  const options = {
    target: { by: 'factor', x: factor, y: factor },
    anchor: 'center',
    algorithm: spec.algorithm,
    similar: spec.similar ?? 0,
    bounds: spec.bounds,
    skipZero: false,
    ...(mask ? { mask } : {}),
  };
  return { name: ADVANCED_COMMAND.pixelsScale, options };
};

export { magnifyStep };
