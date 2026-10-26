/* @layer core @kind logic */
import { requireSprite } from '../../read/require-sprite';
import { guideMoveSchema } from '../../schema/guide-move-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkGuide } from './check-guide';
import { guideLine } from './guide-line';
import { requireGuide } from './require-guide';
import { setGuideLine } from './set-guide-line';
import { targetSprite } from './target-sprite';

const guideMove = defineCommand({
  name: COMMAND_NAME.guideMove,
  scope: 'sprite',
  schema: guideMoveSchema,
  run: (draft, input) => {
    const spriteId = targetSprite(input.sprites);
    const { axis, from, to } = input.options;
    const sprite = requireSprite(draft.artwork, spriteId);
    requireGuide(sprite, axis, from, 'options.from');
    checkGuide(sprite, axis, to, 'options.to');
    if (from === to) return;
    setGuideLine(draft, spriteId, axis, guideLine(sprite, axis).map((position) => (position === from ? to : position)));
  },
});

export { guideMove };
