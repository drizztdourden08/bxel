/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { PresetId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';

const presetRefSchema = entityRefSchema<PresetId>(ID_PREFIX.preset);

export { presetRefSchema };
