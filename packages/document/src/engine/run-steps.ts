/* @layer core @kind logic */
import { CommandFailure } from '../commands/command-failure';
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { RETIRED_COMMANDS, RETIRED_MESSAGE } from '../commands/retired-commands.constants';
import { parseOptions } from '../commands/parse-options';
import type { DraftRun, StepRun } from './engine.type';
import { checkLinked } from './check-linked';
import { guardTransparency } from './guard-transparency';
import { resolveStepTargets } from './resolve-step-targets';

const runStep = ({ store, draft, step, index }: StepRun): void => {
  const def = store.registry.get(step.name);
  if (!def && RETIRED_COMMANDS.has(step.name)) throw fail(ERROR_CODE.INVALID_OPTION, RETIRED_MESSAGE, { path: `steps.${index}.name` });
  if (!def) throw fail(ERROR_CODE.UNKNOWN_COMMAND, `Unknown command "${step.name}".`, { path: `steps.${index}.name` });
  draft.step = index;
  const options = parseOptions(def.schema, step.options, `steps.${index}.options`);
  const targets = resolveStepTargets({ draft, scope: def.scope, targets: step.targets, index });
  checkLinked({ draft, def, options, cels: targets.cels });
  const restore = guardTransparency(draft, step.name, targets.cels);
  def.run(draft, { options, step: index, ref: step.ref, sprites: targets.sprites, cels: targets.cels });
  restore?.();
};

const runSteps = ({ store, draft, request }: DraftRun): void => {
  for (const [index, step] of request.steps.entries()) {
    try {
      runStep({ store, draft, step, index });
    } catch (error) {
      if (error instanceof CommandFailure && error.error.step === null) {
        throw new CommandFailure({ ...error.error, step: index });
      }
      throw error;
    }
  }
};

export { runSteps };
