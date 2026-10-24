/* @layer core @kind logic */
import { MAX_STEPS } from '@bxel/document';
import { z } from 'zod';
import type { StepCommand } from './step-command.type';
import { stepSchemaOf } from './step-schema-of';

const buildStepsSchema = (commands: readonly StepCommand[]) => {
  const [first, ...rest] = commands.map(stepSchemaOf);
  if (!first) throw new Error('A batch needs at least one registered command.');
  return z.array(z.discriminatedUnion('name', [first, ...rest])).min(1).max(MAX_STEPS);
};

export { buildStepsSchema };
