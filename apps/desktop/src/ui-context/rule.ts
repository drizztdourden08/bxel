/* @layer renderer-app @kind logic */
import type { BxelContext } from './bxel-context.type';
import type { RuleSpec, UiRule } from './ui-rule.type';

const textOf = (need: string | ((context: BxelContext) => string), context: BxelContext): string => (typeof need === 'string' ? need : need(context));

const rule = (spec: RuleSpec): UiRule => {
  const needs = spec.needs ?? [];
  return {
    applies: spec.applies,
    ...(needs.length > 0
      ? {
          ready: (context: BxelContext) => needs.every(([pred]) => pred(context)),
          reason: (context: BxelContext) => {
            const failed = needs.find(([pred]) => !pred(context));
            return failed ? textOf(failed[1], context) : '';
          },
        }
      : {}),
    ...(spec.only === undefined ? {} : { only: spec.only }),
  };
};

export { rule };
