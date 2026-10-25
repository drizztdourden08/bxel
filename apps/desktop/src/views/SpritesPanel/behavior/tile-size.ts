/* @layer renderer-app @kind logic */
import type { VirtualSize } from '@drizztdourden08/tessera';
import { TILE_EXTRA, TILE_SIZES } from '../SpritesPanel.constants';
import type { TileSize } from '../SpritesPanel.type';

const tokenFor = (need: number): VirtualSize => (TILE_SIZES.find((size) => size.px >= need) ?? TILE_SIZES[TILE_SIZES.length - 1])?.token ?? 'size-256';

const tileSize = (box: number): TileSize => ({ width: tokenFor(box + TILE_EXTRA.width), height: tokenFor(box + TILE_EXTRA.height) });

export { tileSize };
