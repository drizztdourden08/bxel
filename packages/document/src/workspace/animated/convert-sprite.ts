/* @layer core @kind logic */
import { freeName } from '../../commands/layer/free-name';
import type { IdSource } from '../../ids/id-source.type';
import type { Sprite } from '../../model/sprite.type';
import type { SplitState } from './animated-split.type';
import { buildAnimation } from './build-animation';
import { planAnimationPath } from './plan-animation-path';
import { retargetPresets } from './retarget-presets';
import { retargetSheets } from './retarget-sheets';

const convertSprite = (state: SplitState, sprite: Sprite, ids: IdSource): void => {
  const { artwork } = state;
  const name = freeName(
    artwork.animations.map((animation) => animation.name),
    sprite.name,
  );
  const built = buildAnimation(ids, sprite, { animation: name, taken: artwork.sprites.map((item) => item.name) });
  const first = built.animation.frames[0]?.spriteId ?? null;
  state.artwork = {
    ...artwork,
    coverSpriteId: artwork.coverSpriteId === sprite.id ? first : artwork.coverSpriteId,
    sprites: [...artwork.sprites.filter((item) => item.id !== sprite.id), ...built.sprites],
    animations: [...artwork.animations, built.animation],
    sheets: retargetSheets(artwork.sheets, sprite.id, built.animation.id),
    presets: retargetPresets(artwork.presets, sprite.id, first),
  };
  const spritePath = state.paths.get(sprite.id) ?? null;
  const taken = new Set([...state.paths.values()].map((path) => path.toLowerCase()));
  const animationPath = planAnimationPath(name, spritePath ?? undefined, taken);
  state.paths.delete(sprite.id);
  state.paths.set(built.animation.id, animationPath);
  if (spritePath !== null) state.trashed.push(spritePath);
  state.conversions.push({
    source: 'sprite',
    spriteId: sprite.id,
    spriteName: sprite.name,
    spritePath,
    animationId: built.animation.id,
    animationName: name,
    animationPath,
    frames: built.animation.frames.length,
  });
};

export { convertSprite };
