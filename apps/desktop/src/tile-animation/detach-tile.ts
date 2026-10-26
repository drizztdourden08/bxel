/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { detachTileStep } from './detach-tile-step';
import { TILE_ANIMATION_LABEL } from './tile-animation.constants';

const detachTile = (tileset: Tileset, key: number): boolean => runDocument(TILE_ANIMATION_LABEL.detach, [detachTileStep(tileset, key)]) !== null;

export { detachTile };
