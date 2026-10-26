/* @layer core @kind logic */
import { freeName } from '../../commands/layer/free-name';
import type { IdSource } from '../../ids/id-source.type';
import type { Sprite } from '../../model/sprite.type';
import type { SplitState } from './animated-split.type';
import { buildAnimation } from './build-animation';
import { firstFrameTile } from './first-frame-tile';
import { planAnimationPath } from './plan-animation-path';

const convertTile = (state: SplitState, sprite: Sprite, ids: IdSource): void => {
  const { artwork } = state;
  const tileset = artwork.tilesets.find((item) => item.tiles.some((tile) => tile.spriteId === sprite.id));
  const tile = tileset?.tiles.find((item) => item.spriteId === sprite.id);
  if (!tileset || !tile) return;
  const name = freeName(
    artwork.animations.map((animation) => animation.name),
    `${tileset.name} ${tile.key}`,
  );
  const built = buildAnimation(ids, sprite, { animation: name, taken: artwork.sprites.map((item) => item.name) });
  const link = { animationId: built.animation.id, tagId: null, start: 'together' } as const;
  state.artwork = {
    ...artwork,
    sprites: [...artwork.sprites.map((item) => (item.id === sprite.id ? firstFrameTile(item) : item)), ...built.sprites],
    animations: [...artwork.animations, built.animation],
    tilesets: artwork.tilesets.map((item) =>
      item.id === tileset.id ? { ...item, tiles: item.tiles.map((entry) => (entry.id === tile.id ? { ...entry, animation: link } : entry)) } : item,
    ),
  };
  const taken = new Set([...state.paths.values()].map((path) => path.toLowerCase()));
  const animationPath = planAnimationPath(name, state.paths.get(tileset.id), taken);
  state.paths.set(built.animation.id, animationPath);
  state.conversions.push({
    source: 'tile',
    spriteId: sprite.id,
    spriteName: sprite.name,
    spritePath: null,
    animationId: built.animation.id,
    animationName: name,
    animationPath,
    frames: built.animation.frames.length,
  });
};

export { convertTile };
