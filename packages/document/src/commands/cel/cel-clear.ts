/* @layer core @kind logic */
import { setCelSlot } from '../../draft/set-cel-slot';
import { celClearSchema } from '../../schema/cel-clear-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const celClear = defineCommand({
  name: COMMAND_NAME.celClear,
  scope: 'cels',
  linked: 'allow',
  schema: celClearSchema,
  run: (draft, input) => {
    for (const target of input.cels) {
      if (target.celId) setCelSlot(draft, target, null);
    }
  },
});

export { celClear };
