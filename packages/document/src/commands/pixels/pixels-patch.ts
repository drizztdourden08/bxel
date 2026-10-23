/* @layer core @kind logic */
import { ensureCel } from '../../draft/ensure-cel';
import { writableCel } from '../../draft/writable-cel';
import { writeRect } from '../../pixels/write-rect';
import { requireSprite } from '../../read/require-sprite';
import { pixelsPatchSchema } from '../../schema/pixels-patch-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkPatch } from './check-patch';

const pixelsPatch = defineCommand({
  name: COMMAND_NAME.pixelsPatch,
  scope: 'cels',
  schema: pixelsPatchSchema,
  run: (draft, input) => {
    const { rect, pixels, skipZero } = input.options;
    checkPatch(draft.project, input.options, input.sprites);
    for (const target of input.cels) {
      const celId = ensureCel(draft, target);
      const stride = requireSprite(draft.project, target.spriteId).width;
      writeRect({ target: writableCel(draft, target.spriteId, celId), stride, rect, pixels, skipZero });
    }
  },
});

export { pixelsPatch };
