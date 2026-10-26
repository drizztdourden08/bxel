/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Tile, Tileset } from '../model/tilemap.type';
import { tileAnimationIssue } from '../read/tile-animation-issue';
import type { Draft } from './draft.type';
import type { AnimationEdit } from './set-tile-animation.type';
import { updateTileset } from './update-tileset';

const withAnimation = (tile: Tile, edit: AnimationEdit): Tile => {
  const { animation: _animation, ...rest } = tile;
  return edit.animation ? { ...rest, animation: edit.animation } : rest;
};

const setTileAnimation = (draft: Draft, tileset: Tileset, edit: AnimationEdit): void => {
  const tile = tileset.tiles.find((item) => item.key === edit.key);
  if (tile && edit.animation) {
    const issue = tileAnimationIssue(draft.artwork, tileset, { ...tile, animation: edit.animation });
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, `Tile ${edit.key} cannot play it: ${issue}`, { path: 'options.change' });
  }
  updateTileset(draft, tileset.id, (current) => ({
    ...current,
    tiles: current.tiles.map((item) => (item.key === edit.key ? withAnimation(item, edit) : item)),
  }));
};

export { setTileAnimation };
