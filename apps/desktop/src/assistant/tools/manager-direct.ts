/* @layer renderer-app @kind logic */
import type { BankId, Sprite } from '@bxel/document';
import type { PlanOf } from '@bxel/mcp';
import { stripPlan } from '../../add-frames/strip-plan';
import { assignBank } from '../../sheet-manager/assign-bank';
import { bankPlan } from '../../sheet-manager/bank-plan';
import { cutStrip } from '../../sheet-manager/cut-strip';
import { cutStripName } from '../../sheet-manager/cut-strip-name';
import { COMPOSE_TEXT } from '../../sheet-manager/compose-text.constants';
import { currentManager } from '../../sheet-manager/current-manager';
import { duplicateNamed } from '../../sheet-manager/duplicate-named';
import { FOLDER_TEXT } from '../../sheet-manager/folder-text.constants';
import type { CurrentManager, RenamePlan } from '../../sheet-manager/manager.type';
import { planFolder } from '../../sheet-manager/plan-folder';
import { planRenames } from '../../sheet-manager/plan-renames';
import { renameSprites } from '../../sheet-manager/rename-sprites';
import { slicePlan } from '../../sheet-manager/slice-plan';
import { sliceSprites } from '../../sheet-manager/slice-sprites';
import { stayingSprites } from '../../sheet-manager/staying-sprites';
import { nameError } from '../../sprite-name/name-error';
import type { Args, Direct } from './direct-commands.type';
import { otherNames, spriteTargets } from './sprite-targets';
import { renameSpec, sliceSpec, stripSpec } from './sprite-specs';

const NO_MANAGER = 'No sprite sheet is open to change.';

const NO_CHANGE = 'No name would change.';

const problemOf = (plan: RenamePlan): string => plan.entries.find((entry) => entry.error !== null)?.error ?? NO_CHANGE;

const withTargets = (args: Args, run: (manager: CurrentManager, sprites: readonly Sprite[]) => string | null): string | null => {
  const manager = currentManager();
  if (manager === null) return NO_MANAGER;
  const wanted = Array.isArray(args.sprites) ? (args.sprites as string[]) : undefined;
  const found = spriteTargets(manager.artwork, wanted, manager.ids);
  return found.ok ? run(manager, found.sprites) : found.problem;
};

const renameMany: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planRenames(renameSpec(args as PlanOf<'rename'>, false), sprites, otherNames(artwork, sprites, false));
    return plan.ok && renameSprites(plan) ? null : problemOf(plan);
  });

const duplicateNamedDirect: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planRenames(renameSpec(args as PlanOf<'rename'>, true), sprites, otherNames(artwork, sprites, true));
    return plan.ok && duplicateNamed(plan) ? null : problemOf(plan);
  });

const moveToFolder: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const plan = planFolder((args as PlanOf<'folder'>).folder, sprites, otherNames(artwork, sprites, false));
    return plan.ok && renameSprites(plan, FOLDER_TEXT.label(plan.changed)) ? null : problemOf(plan);
  });

const setPalette: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const bankId = (args as { bankId: BankId }).bankId;
    const plan = bankPlan(artwork, sprites, bankId);
    if (plan.blocker !== null) return plan.blocker;
    return assignBank(sprites.map((sprite) => sprite.id), bankId) ? null : 'The palette did not change.';
  });

const sliceDirect: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const spec = sliceSpec(args as PlanOf<'slice'>);
    const plan = slicePlan(spec, sprites, stayingSprites(artwork, sprites, spec.keep));
    if (plan.error !== null) return plan.error;
    return sliceSprites(sprites.map((sprite) => sprite.id), spec, plan.clashes) ? null : COMPOSE_TEXT.nameProblem;
  });

const cutStripDirect: Direct = async (args) => {
  const manager = currentManager();
  if (manager === null) return NO_MANAGER;
  const wanted = (args as PlanOf<'strip'>).sprite;
  const found = spriteTargets(manager.artwork, wanted === undefined ? undefined : [wanted], manager.ids);
  if (!found.ok) return found.problem;
  const [target] = found.sprites;
  if (found.sprites.length !== 1 || target === undefined) return COMPOSE_TEXT.needStrip;
  const spec = stripSpec(args as PlanOf<'strip'>, target, manager.sheet);
  const name = cutStripName(spec.name, target);
  const problem = nameError(name, manager.artwork.animations.map((animation) => animation.name)) ?? stripPlan(target, spec.strip).error;
  if (problem !== null) return problem;
  return (await cutStrip(target.id, name, spec)) ? null : COMPOSE_TEXT.nameProblem;
};

export { cutStripDirect, duplicateNamedDirect, moveToFolder, renameMany, setPalette, sliceDirect };
