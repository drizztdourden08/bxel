/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { TilesetId } from '../../model/ids.type';
import type { Tileset } from '../../model/tilemap.type';
import { requireTileset } from '../../read/require-tileset';
import type { EntityRef } from '../../schema/entity-ref.type';
import { resolveRefId } from './resolve-ref-id';

const pickTileset = (draft: Draft, ref: EntityRef<TilesetId>): Tileset =>
  requireTileset(draft.artwork, resolveRefId(draft, ref, 'options.tileset'));

export { pickTileset };
