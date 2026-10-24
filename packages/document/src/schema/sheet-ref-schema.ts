/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SheetId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const sheetRefSchema = entityRefSchema<SheetId>(ID_PREFIX.sheet);

export { sheetRefSchema };
