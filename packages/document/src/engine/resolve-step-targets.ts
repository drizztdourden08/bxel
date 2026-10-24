/* @layer core @kind logic */
import type { CommandScope } from '../commands/command-def.type';
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import { resolveScope } from '../scope/resolve-scope';
import { resolveSprites } from '../scope/resolve-sprites';
import type { ResolvedScope } from '../scope/resolved-scope.type';
import type { TargetScope } from '../scope/target-scope.type';

const resolveStepTargets = ({
  draft,
  scope,
  targets,
  index,
}: {
  draft: Draft;
  scope: CommandScope;
  targets: TargetScope | null;
  index: number;
}): Pick<ResolvedScope, 'sprites' | 'cels'> => {
  if (scope === 'none') return { sprites: [], cels: [] };
  const path = `steps.${index}.targets`;
  if (!targets) throw fail(ERROR_CODE.INVALID_OPTION, 'This command needs targets.', { path });
  if (scope === 'sprite' || scope === 'sprites') {
    const sprites = resolveSprites({ project: draft.project, refs: targets.sprites, created: draft.created });
    if (scope === 'sprite' && sprites.length !== 1) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'This command targets exactly one sprite.', { path });
    }
    return { sprites, cels: [] };
  }
  const resolved = resolveScope({ project: draft.project, scope: targets, created: draft.created, step: index });
  draft.warnings.push(...resolved.warnings);
  return resolved;
};

export { resolveStepTargets };
