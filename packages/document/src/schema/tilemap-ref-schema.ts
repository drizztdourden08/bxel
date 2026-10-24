/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { TilemapId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const tilemapRefSchema = entityRefSchema<TilemapId>(ID_PREFIX.tilemap);

export { tilemapRefSchema };
