/* @layer core @kind logic */
import type { z } from 'zod';
import type { CommandDef, CommandSpec } from './command-def.type';

const defineCommand = <S extends z.ZodType>(spec: CommandSpec<S>): CommandDef => ({
  name: spec.name,
  scope: spec.scope,
  linked: spec.linked ?? 'refuse',
  schema: spec.schema,
  run: (draft, input) => {
    spec.run(draft, { ...input, options: input.options as z.output<S> });
  },
});

export { defineCommand };
