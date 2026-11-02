/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { PatternId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const patternRefSchema = entityRefSchema<PatternId>(ID_PREFIX.pattern);

export { patternRefSchema };
