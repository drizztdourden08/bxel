/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SpriteId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const spriteRefSchema = entityRefSchema<SpriteId>(ID_PREFIX.sprite);

export { spriteRefSchema };
