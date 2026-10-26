/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import { requireSprite } from '../../read/require-sprite';
import { guideClearSchema } from '../../schema/guide-clear-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { EMPTY_GUIDES } from './guide.constants';
import { targetSprite } from './target-sprite';
import { withGuides } from './with-guides';

const guideClear = defineCommand({
  name: COMMAND_NAME.guideClear,
  scope: 'sprite',
  schema: guideClearSchema,
  run: (draft, input) => {
    const spriteId = targetSprite(input.sprites);
    const { axis } = input.options;
    const { guides } = requireSprite(draft.artwork, spriteId);
    if (!guides) return;
    const next = axis === undefined ? EMPTY_GUIDES : { ...guides, [axis]: [] };
    updateSprite(draft, spriteId, (current) => withGuides(current, next));
  },
});

export { guideClear };
