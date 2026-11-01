/* @layer renderer-app @kind logic */
import type { PlanOf } from '@bxel/mcp';
import { FOLDER_TEXT } from '../../sheet-manager/folder-text.constants';
import { planFolder } from '../../sheet-manager/plan-folder';
import { renameSprites } from '../../sheet-manager/rename-sprites';
import type { Direct } from './direct-commands.type';
import { otherNames } from './other-names';
import { problemOf } from './problem-of';
import { withTargets } from './with-targets';

const moveToFolder: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planFolder((args as PlanOf<'folder'>).folder, sprites, otherNames(artwork, sprites, false));
    return plan.ok && renameSprites(plan, FOLDER_TEXT.label(plan.changed)) ? null : problemOf(plan);
  });

export { moveToFolder };
