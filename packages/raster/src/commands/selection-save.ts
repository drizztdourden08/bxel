/* @layer core @kind logic */
import { ERROR_CODE, MAX_SAVED_SELECTIONS, defineCommand, fail, requireSprite, updateSprite } from '@bxel/document';
import type { SavedSelection } from '@bxel/document';
import { maskBounds } from '../selection/mask-bounds';
import { maskRuns } from '../selection/mask-runs';
import { SELECTION_COMMAND } from './selection-commands.constants';
import { selectionSaveSchema } from './schema/selection-save-schema';

const selectionSave = defineCommand({
  name: SELECTION_COMMAND.selectionSave,
  scope: 'sprite',
  schema: selectionSaveSchema,
  run: (draft, input) => {
    const [spriteId] = input.sprites;
    if (!spriteId) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'No sprite was targeted.');
    const { name, mask } = input.options;
    const sprite = requireSprite(draft.artwork, spriteId);
    if (mask.width !== sprite.width || mask.height !== sprite.height) {
      throw fail(ERROR_CODE.INVALID_OPTION, `The mask is ${mask.width} by ${mask.height} but the sprite is ${sprite.width} by ${sprite.height}.`, { path: 'options.mask' });
    }
    if (maskBounds(mask) === null) throw fail(ERROR_CODE.TARGET_EMPTY, 'Nothing is selected, so there is nothing to save.', { path: 'options.mask' });
    const kept = (sprite.selections ?? []).filter((each) => each.name !== name);
    if (kept.length >= MAX_SAVED_SELECTIONS) throw fail(ERROR_CODE.LIMIT_REACHED, `A sprite holds at most ${MAX_SAVED_SELECTIONS} saved selections.`);
    const saved: SavedSelection = { name, width: mask.width, height: mask.height, runs: maskRuns(mask) };
    updateSprite(draft, spriteId, (current) => ({ ...current, selections: [...kept, saved] }));
  },
});

export { selectionSave };
