/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BrushId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const brushRefSchema = entityRefSchema<BrushId>(ID_PREFIX.brush);

export { brushRefSchema };
