/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { setTileStep } from './set-tile-step';
import { TILE_ANIMATION_LABEL } from './tile-animation.constants';
import type { TileLink } from './tile-animation-steps.type';

const linkTile = (tileset: Tileset, key: number, link: TileLink): boolean =>
  runDocument(TILE_ANIMATION_LABEL.set, [setTileStep(tileset, key, link)]) !== null;

export { linkTile };
