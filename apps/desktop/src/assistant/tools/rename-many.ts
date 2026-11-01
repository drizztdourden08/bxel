/* @layer renderer-app @kind logic */
import { planRenames } from '../../sheet-manager/plan-renames';
import { renameSprites } from '../../sheet-manager/rename-sprites';
import type { Direct } from './direct-commands.type';
import { otherNames } from './other-names';
import { problemOf } from './problem-of';
import { renameSpec } from './rename-spec';
import { withTargets } from './with-targets';

const renameMany: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planRenames(renameSpec(args, false), sprites, otherNames(artwork, sprites, false));
    return plan.ok && renameSprites(plan) ? null : problemOf(plan);
  });

export { renameMany };
