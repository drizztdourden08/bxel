/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SpriteId } from '../model/ids.type';
import { entityRefSchema } from './entity-ref-schema';
import { sheetRefSchema } from './sheet-ref-schema';

const presetOwnerSchema = z.union([
  z.strictObject({ sprite: entityRefSchema<SpriteId>(ID_PREFIX.sprite) }),
  z.strictObject({ sheet: sheetRefSchema }),
  z.strictObject({ project: z.literal(true) }),
]);

export { presetOwnerSchema };
