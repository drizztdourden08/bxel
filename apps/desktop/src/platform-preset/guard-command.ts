/* @layer renderer-app @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { CommandDef } from '@bxel/document';
import { STRICT_TEXT } from './platform-preset.constants';
import { strictBreak } from './strict-break';

const guardCommand = (def: CommandDef): CommandDef => ({
  ...def,
  run: (draft, input) => {
    const before = draft.artwork;
    def.run(draft, input);
    if (draft.artwork === before) return;
    const message = strictBreak(before, draft.artwork);
    if (message !== null) throw fail(ERROR_CODE.PLATFORM_RULE, STRICT_TEXT.blocked(message), { step: input.step });
  },
});

export { guardCommand };
