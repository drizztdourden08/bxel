/* @layer renderer-app @kind logic */
import type { VirtualSize } from '@drizztdourden08/tessera';
import { SIZE_STEPS } from '../../../size-steps/size-steps.constants';
import { TILE_EXTRA } from '../EntryTile.constants';
import type { TileSize } from '../EntryTile.type';

const tokenFor = (need: number): VirtualSize => (SIZE_STEPS.find((size) => size.px >= need) ?? SIZE_STEPS[SIZE_STEPS.length - 1])?.token ?? 'size-256';

const tileSize = (box: number): TileSize => ({ width: tokenFor(box + TILE_EXTRA.width), height: tokenFor(box + TILE_EXTRA.height) });

export { tileSize };
