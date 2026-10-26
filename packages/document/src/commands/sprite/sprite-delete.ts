/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { addWarning } from '../../draft/add-warning';
import { dropSprites } from '../../draft/drop-sprites';
import { animationUsers } from '../../read/animation-users';
import { findSprite } from '../../read/find-sprite';
import { spriteDeleteSchema } from '../../schema/sprite-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const spriteDelete = defineCommand({
  name: COMMAND_NAME.spriteDelete,
  scope: 'sprites',
  schema: spriteDeleteSchema,
  run: (draft, input) => {
    const gone = new Set(input.sprites);
    const tile = draft.artwork.tilesets.flatMap((tileset) => tileset.tiles).find((item) => gone.has(item.spriteId));
    if (tile) {
      const name = findSprite(draft.artwork, tile.spriteId)?.name ?? tile.spriteId;
      throw fail(ERROR_CODE.TILE_IN_USE, `Sprite "${name}" is a tile of a tileset. Delete the tile first.`);
    }
    const owned = input.sprites.map((id) => findSprite(draft.artwork, id)).find((sprite) => sprite?.role === 'frame');
    if (owned) throw fail(ERROR_CODE.SPRITE_OWNED, `Sprite "${owned.name}" is a frame of an animation. Delete the frame first.`);
    const users = input.sprites.flatMap((id) => animationUsers(draft.artwork, id));
    if (users.length > 0 && input.options.detachAnimations !== true) {
      const names = [...new Set(users.map((user) => `"${user.name}"`))].join(', ');
      throw fail(ERROR_CODE.ANIMATION_IN_USE, `Animation ${names} uses this sprite. Pass detachAnimations to empty those frames.`, { path: 'options.detachAnimations' });
    }
    const left = draft.artwork.sprites.filter((sprite) => sprite.role === 'sprite' && !gone.has(sprite.id));
    if (left.length === 0) throw fail(ERROR_CODE.LAST_SPRITE, 'A file keeps at least one sprite.');
    const frames = users.reduce((total, user) => total + user.frames, 0);
    dropSprites(draft, gone);
    if (frames > 0) {
      addReport(draft, 'frames', frames);
      addWarning(draft, 'FRAMES_EMPTIED', `${frames} animation frames used the deleted sprite and are now empty.`);
    }
  },
});

export { spriteDelete };
