/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { TilesetId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const tilesetRefSchema = entityRefSchema<TilesetId>(ID_PREFIX.tileset);

export { tilesetRefSchema };
