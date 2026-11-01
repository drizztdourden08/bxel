/* @layer renderer-app @kind logic */
import { COMPOSE_TEXT } from '../../sheet-manager/compose-text.constants';
import { slicePlan } from '../../sheet-manager/slice-plan';
import { sliceSprites } from '../../sheet-manager/slice-sprites';
import { stayingSprites } from '../../sheet-manager/staying-sprites';
import type { Direct } from './direct-commands.type';
import { sliceSpec } from './slice-spec';
import { withTargets } from './with-targets';

const sliceDirect: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const spec = sliceSpec(args);
    const plan = slicePlan(spec, sprites, stayingSprites(artwork, sprites, spec.keep));
    if (plan.error !== null) return plan.error;
    return sliceSprites(sprites.map((sprite) => sprite.id), spec, plan.clashes) ? null : COMPOSE_TEXT.nameProblem;
  });

export { sliceDirect };
