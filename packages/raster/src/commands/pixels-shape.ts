/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand } from '@bxel/document';
import { drawShape } from '../draw-shape';
import { applyToCels } from './apply-to-cels';
import { checkTargets } from './check-targets';
import { pixelsShapeSchema } from './schema/pixels-shape-schema';

const pixelsShape = defineCommand({
  name: COMMAND_NAME.pixelsShape,
  scope: 'cels',
  schema: pixelsShapeSchema,
  run: (draft, input) => {
    const { index, mask, ...rest } = input.options;
    checkTargets({ project: draft.project, sprites: input.sprites, index, mask });
    applyToCels(draft, input.cels, (target) => drawShape({ ...rest, target, index, mask }));
  },
});

export { pixelsShape };
