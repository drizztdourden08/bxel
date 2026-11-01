/* @layer renderer-app @kind logic */
import { duplicateNamed } from '../../sheet-manager/duplicate-named';
import { planRenames } from '../../sheet-manager/plan-renames';
import type { Direct } from './direct-commands.type';
import { otherNames } from './other-names';
import { problemOf } from './problem-of';
import { renameSpec } from './rename-spec';
import { withTargets } from './with-targets';

const duplicateNamedDirect: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planRenames(renameSpec(args, true), sprites, otherNames(artwork, sprites, true));
    return plan.ok && duplicateNamed(plan) ? null : problemOf(plan);
  });

export { duplicateNamedDirect };
