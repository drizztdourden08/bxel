/* @layer core @kind logic */
import { z } from 'zod';
import { TARGET_SCOPE_SCHEMA } from './changes.constants';
import type { StepCommand } from './step-command.type';
import { WIRE_OPTIONS } from './wire-options.constants';
import { withWireMask } from './wire-mask';

const stepSchemaOf = (command: StepCommand) =>
  z.strictObject({
    name: z.literal(command.name),
    targets: command.scope === 'none' ? z.null().optional() : TARGET_SCOPE_SCHEMA,
    ref: z.string().min(1).max(64).optional(),
    options: command.wire ?? WIRE_OPTIONS.get(command.name) ?? withWireMask(command.schema),
  });

export { stepSchemaOf };
