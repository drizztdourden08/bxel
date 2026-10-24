/* @layer core @kind logic */
import type { CommandDef } from '../commands/command-def.type';
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import type { ResolvedCel } from '../scope/resolved-scope.type';
import { linkedIssues } from './linked-issues';

const allowsAllUses = (options: unknown): boolean =>
  typeof options === 'object' && options !== null && 'allUses' in options && options.allUses === true;

const checkLinked = ({
  draft,
  def,
  options,
  cels,
}: {
  draft: Draft;
  def: CommandDef;
  options: unknown;
  cels: readonly ResolvedCel[];
}): void => {
  if (def.scope !== 'cels' || def.linked === 'allow' || allowsAllUses(options)) return;
  const details = linkedIssues(draft.artwork, cels);
  if (details.length > 0) {
    throw fail(ERROR_CODE.CEL_LINKED, 'A linked cel is shared with other layers or frames. Pass allUses to edit every use.', {
      details,
    });
  }
};

export { checkLinked };
