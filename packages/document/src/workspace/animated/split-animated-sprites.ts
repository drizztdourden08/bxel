/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { Artwork } from '../../model/artwork.type';
import type { AssetPaths } from '../asset-paths.type';
import { animatedNotice } from './animated-notice';
import type { AnimatedSplit, SplitState } from './animated-split.type';
import { convertSprite } from './convert-sprite';
import { convertTile } from './convert-tile';

const splitAnimatedSprites = (artwork: Artwork, paths: AssetPaths, ids: IdSource): AnimatedSplit => {
  const targets = artwork.sprites.filter((sprite) => sprite.frames.length > 1 && sprite.role !== 'frame');
  const state: SplitState = { artwork, paths: new Map(paths), conversions: [], trashed: [] };
  for (const sprite of targets) {
    if (sprite.role === 'tile') convertTile(state, sprite, ids);
    else convertSprite(state, sprite, ids);
  }
  return {
    artwork: state.artwork,
    paths: state.paths,
    conversions: state.conversions,
    trashed: state.trashed,
    notice: animatedNotice(state.conversions),
  };
};

export { splitAnimatedSprites };
