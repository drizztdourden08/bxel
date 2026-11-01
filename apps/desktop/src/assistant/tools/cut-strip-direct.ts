/* @layer renderer-app @kind logic */
import type { PlanOf } from '@bxel/mcp';
import { stripPlan } from '../../add-frames/strip-plan';
import { COMPOSE_TEXT } from '../../sheet-manager/compose-text.constants';
import { currentManager } from '../../sheet-manager/current-manager';
import { cutStrip } from '../../sheet-manager/cut-strip';
import { cutStripName } from '../../sheet-manager/cut-strip-name';
import { nameError } from '../../sprite-name/name-error';
import type { Direct } from './direct-commands.type';
import { NO_MANAGER } from './manager-direct.constants';
import { spriteTargets } from './sprite-targets';
import { stripSpec } from './strip-spec';

const cutStripDirect: Direct = async (args) => {
  const manager = currentManager();
  if (manager === null) return NO_MANAGER;
  const wanted = (args as PlanOf<'strip'>).sprite;
  const found = spriteTargets(manager.artwork, wanted === undefined ? undefined : [wanted], manager.ids);
  if (!found.ok) return found.problem;
  const [target] = found.sprites;
  if (found.sprites.length !== 1 || target === undefined) return COMPOSE_TEXT.needStrip;
  const spec = stripSpec(args, target, manager.sheet);
  const name = cutStripName(spec.name, target);
  const problem = nameError(name, manager.artwork.animations.map((animation) => animation.name)) ?? stripPlan(target, spec.strip).error;
  if (problem !== null) return problem;
  return (await cutStrip(target.id, name, spec)) ? null : COMPOSE_TEXT.nameProblem;
};

export { cutStripDirect };
