/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import { sliceDeleteSchema } from '../../schema/slice-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickSlices } from './pick-slices';

const sliceDelete = defineCommand({
  name: COMMAND_NAME.sliceDelete,
  scope: 'sprites',
  schema: sliceDeleteSchema,
  run: (draft, input) => {
    for (const { sprite, slice } of pickSlices(draft.artwork, input.sprites, input.options.slice)) {
      updateSprite(draft, sprite.id, (current) => ({
        ...current,
        slices: current.slices.filter((item) => item.id !== slice.id),
      }));
    }
  },
});

export { sliceDelete };
