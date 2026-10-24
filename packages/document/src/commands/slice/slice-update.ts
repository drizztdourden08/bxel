/* @layer core @kind logic */
import { updateSprite } from '../../draft/update-sprite';
import type { Slice } from '../../model/sprite.type';
import { sliceUpdateSchema } from '../../schema/slice-update-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkSlice } from './check-slice';
import { pickSlices } from './pick-slices';

const sliceUpdate = defineCommand({
  name: COMMAND_NAME.sliceUpdate,
  scope: 'sprites',
  schema: sliceUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    for (const { sprite, slice } of pickSlices(draft.artwork, input.sprites, options.slice)) {
      const name = options.name === undefined ? slice.name : checkName(options.name);
      assertNameFree(
        sprite.slices.filter((other) => other.id !== slice.id).map((other) => other.name),
        name,
      );
      const next: Slice = {
        ...slice,
        name,
        rect: options.rect ?? slice.rect,
        pivot: options.pivot === undefined ? slice.pivot : options.pivot,
        center: options.center === undefined ? slice.center : options.center,
      };
      checkSlice(next, sprite);
      updateSprite(draft, sprite.id, (current) => ({
        ...current,
        slices: current.slices.map((item) => (item.id === slice.id ? next : item)),
      }));
    }
  },
});

export { sliceUpdate };
