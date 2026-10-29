/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { TilemapId } from '../../model/ids.type';
import { MAX_MAP_LAYERS } from '../../model/tilemap-limits.constants';
import type { Tilemap } from '../../model/tilemap.type';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTilemap } from './pick-tilemap';

const pickRoomyTilemap = (draft: Draft, ref: EntityRef<TilemapId>): Tilemap => {
  const tilemap = pickTilemap(draft, ref);
  if (tilemap.layers.length >= MAX_MAP_LAYERS) {
    throw fail(ERROR_CODE.LIMIT_REACHED, `A tilemap holds at most ${MAX_MAP_LAYERS} layers.`);
  }
  return tilemap;
};

export { pickRoomyTilemap };
