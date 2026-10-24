/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { currentArtwork } from './current-artwork';
import { runDocument } from './run-document';
import { SPRITE_LABEL } from './sprite-label.constants';
import { spritesTarget } from './sprites-target';

const removeSlices = (ids: readonly SpriteId[]): boolean => {
  const sprites = (currentArtwork()?.sprites ?? []).filter((sprite) => ids.includes(sprite.id));
  const steps: CommandStep[] = sprites.flatMap((sprite) =>
    sprite.slices.map((slice) => ({
      name: COMMAND_NAME.sliceDelete,
      targets: spritesTarget([sprite.id]),
      options: { slice: { by: 'id', id: slice.id } },
    })),
  );
  return steps.length > 0 && runDocument(SPRITE_LABEL.removeSlices, steps) !== null;
};

export { removeSlices };
