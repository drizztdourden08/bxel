/* @layer core @kind logic */
import { requireSprite } from '../../read/require-sprite';
import { guideRemoveSchema } from '../../schema/guide-remove-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { guideLine } from './guide-line';
import { requireGuide } from './require-guide';
import { setGuideLine } from './set-guide-line';
import { targetSprite } from './target-sprite';

const guideRemove = defineCommand({
  name: COMMAND_NAME.guideRemove,
  scope: 'sprite',
  schema: guideRemoveSchema,
  run: (draft, input) => {
    const spriteId = targetSprite(input.sprites);
    const { axis, position } = input.options;
    const sprite = requireSprite(draft.artwork, spriteId);
    requireGuide(sprite, axis, position, 'options.position');
    setGuideLine(draft, spriteId, axis, guideLine(sprite, axis).filter((each) => each !== position));
  },
});

export { guideRemove };
