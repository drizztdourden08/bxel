/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { TilemapId } from '../../model/ids.type';
import type { Tilemap } from '../../model/tilemap.type';
import { requireTilemap } from '../../read/require-tilemap';
import type { EntityRef } from '../../schema/entity-ref.type';
import { resolveRefId } from './resolve-ref-id';

const pickTilemap = (draft: Draft, ref: EntityRef<TilemapId>): Tilemap =>
  requireTilemap(draft.artwork, resolveRefId(draft, ref, 'options.tilemap'));

export { pickTilemap };
