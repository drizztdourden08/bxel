/* @layer core @kind logic */
import { addReport, defineCommand } from '@bxel/document';
import { replaceRamp } from '../region/replace-ramp';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { REPORT_KEY } from './report-key.constants';
import { resolveRamps } from './resolve-ramps';
import { pixelsReplaceRampSchema } from './schema/pixels-replace-ramp-schema';
import { spriteCels } from './sprite-cels';

const pixelsReplaceRamp = defineCommand({
  name: ADVANCED_COMMAND.pixelsReplaceRamp,
  scope: 'cels',
  schema: pixelsReplaceRampSchema,
  run: (draft, input) => {
    const { from, to, mask } = input.options;
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: 0, mask });
    const sources = resolveRamps({ artwork: draft.artwork, sprites: input.sprites, name: from, needs: 1 });
    const targets = resolveRamps({ artwork: draft.artwork, sprites: input.sprites, name: to, needs: 1 });
    let changed = 0;
    for (const [spriteId, source] of sources) {
      const destination = targets.get(spriteId) ?? [];
      applyToCels(draft, spriteCels(input.cels, spriteId), (target) => {
        const result = replaceRamp({ target, from: source, to: destination, mask });
        changed += result.count;
        return result.rect;
      });
    }
    addReport(draft, REPORT_KEY.pixelsReplaced, changed);
  },
});

export { pixelsReplaceRamp };
