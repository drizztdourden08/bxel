/* @layer core @kind logic */
import { ERROR_CODE, defineCommand, fail, requireSprite, updateSprite } from '@bxel/document';
import { SELECTION_COMMAND } from './selection-commands.constants';
import { selectionDeleteSchema } from './schema/selection-delete-schema';

const selectionDelete = defineCommand({
  name: SELECTION_COMMAND.selectionDelete,
  scope: 'sprite',
  schema: selectionDeleteSchema,
  run: (draft, input) => {
    const [spriteId] = input.sprites;
    if (!spriteId) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'No sprite was targeted.');
    const { name } = input.options;
    const sprite = requireSprite(draft.artwork, spriteId);
    const kept = (sprite.selections ?? []).filter((each) => each.name !== name);
    if (kept.length === (sprite.selections ?? []).length) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `No saved selection is called "${name}".`, { path: 'options.name' });
    updateSprite(draft, spriteId, ({ selections: _dropped, ...rest }) => (kept.length === 0 ? rest : { ...rest, selections: kept }));
  },
});

export { selectionDelete };
