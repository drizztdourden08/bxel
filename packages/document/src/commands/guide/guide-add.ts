/* @layer core @kind logic */
import { MAX_GUIDES } from '../../model/limits.constants';
import { requireSprite } from '../../read/require-sprite';
import { guideAddSchema } from '../../schema/guide-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { checkGuide } from './check-guide';
import { guideLine } from './guide-line';
import { setGuideLine } from './set-guide-line';
import { targetSprite } from './target-sprite';

const guideAdd = defineCommand({
  name: COMMAND_NAME.guideAdd,
  scope: 'sprite',
  schema: guideAddSchema,
  run: (draft, input) => {
    const spriteId = targetSprite(input.sprites);
    const { axis, position } = input.options;
    const sprite = requireSprite(draft.artwork, spriteId);
    checkGuide(sprite, axis, position, 'options.position');
    const line = guideLine(sprite, axis);
    if (line.includes(position)) return;
    if (line.length >= MAX_GUIDES) throw fail(ERROR_CODE.LIMIT_REACHED, `A sprite holds at most ${MAX_GUIDES} guides on one axis.`);
    setGuideLine(draft, spriteId, axis, [...line, position]);
  },
});

export { guideAdd };
