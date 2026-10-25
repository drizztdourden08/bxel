/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { floodFill } from '../flood-fill';
import { applyToCels } from './apply-to-cels';
import { checkSeed } from './check-seed';
import { checkTargets } from './check-targets';
import { pixelsFillSchema } from './schema/pixels-fill-schema';

const pixelsFill = defineCommand({
  name: COMMAND_NAME.pixelsFill,
  scope: 'cels',
  schema: pixelsFillSchema,
  run: (draft, input) => {
    const { x, y, index, mode, connectivity, mask, wrap } = input.options;
    const seed = { x, y };
    checkTargets({ artwork: draft.artwork, sprites: input.sprites, index, mask });
    checkSeed({ artwork: draft.artwork, sprites: input.sprites, seed, wrap });
    applyToCels(draft, input.cels, (target) => floodFill({ target, seed, index, mode, connectivity, mask, wrap }));
  },
});

export { pixelsFill };
