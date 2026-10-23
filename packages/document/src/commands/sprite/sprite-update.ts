/* @layer core @kind logic */
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { updateSprite } from '../../draft/update-sprite';
import { requireSprite } from '../../read/require-sprite';
import { spriteUpdateSchema } from '../../schema/sprite-update-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { checkPivot } from '../../validate/check-pivot';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const spriteUpdate = defineCommand({
  name: COMMAND_NAME.spriteUpdate,
  scope: 'sprite',
  schema: spriteUpdateSchema,
  run: (draft, input) => {
    const spriteId = input.sprites[0];
    if (!spriteId) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'No sprite was targeted.');
    const sprite = requireSprite(draft.project, spriteId);
    const { options } = input;
    const name = options.name === undefined ? sprite.name : checkName(options.name);
    assertNameFree(
      draft.project.sprites.filter((other) => other.id !== sprite.id).map((other) => other.name),
      name,
    );
    if (options.pivot) checkPivot(options.pivot, sprite);
    const pivot = options.pivot ?? sprite.pivot;
    const samePivot = pivot.x2 === sprite.pivot.x2 && pivot.y2 === sprite.pivot.y2;
    updateSprite(draft, spriteId, (current) => ({ ...current, name, pivot: samePivot ? current.pivot : pivot }));
  },
});

export { spriteUpdate };
