/* @layer core @kind logic */
import { addWarning, defineCommand } from '@bxel/document';
import { replaceIndex } from '../region/replace-index';
import { ADVANCED_COMMAND, PIXELS_REPLACED } from './advanced-commands.constants';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { pixelsReplaceSchema } from './schema/pixels-replace-schema';
import { uniqueCels } from './unique-cels';

const pixelsReplace = defineCommand({
  name: ADVANCED_COMMAND.pixelsReplace,
  scope: 'cels',
  schema: pixelsReplaceSchema,
  run: (draft, input) => {
    const { from, to, mask } = input.options;
    checkTargets({ project: draft.project, sprites: input.sprites, index: Math.max(from, to), mask });
    let changed = 0;
    applyToCels(draft, uniqueCels(input.cels), (target) => {
      const result = replaceIndex({ target, from, to, mask });
      changed += result.count;
      return result.rect;
    });
    addWarning(draft, PIXELS_REPLACED, `${changed} pixel(s) replaced.`);
  },
});

export { pixelsReplace };
