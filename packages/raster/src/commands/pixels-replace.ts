/* @layer core @kind logic */
import { addReport, defineCommand } from '@bxel/document';
import { replaceIndex } from '../region/replace-index';
import { ADVANCED_COMMAND } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { REPORT_KEY } from './report-key.constants';
import { pixelsReplaceSchema } from './schema/pixels-replace-schema';
import { uniqueCels } from './unique-cels';

const pixelsReplace = defineCommand({
  name: ADVANCED_COMMAND.pixelsReplace,
  scope: 'cels',
  schema: pixelsReplaceSchema,
  run: (draft, input) => {
    const { from, to, mask } = input.options;
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index: Math.max(from, to), mask });
    let changed = 0;
    applyToCels(draft, uniqueCels(input.cels), (target) => {
      const result = replaceIndex({ target, from, to, mask });
      changed += result.count;
      return result.rect;
    });
    addReport(draft, REPORT_KEY.pixelsReplaced, changed);
  },
});

export { pixelsReplace };
