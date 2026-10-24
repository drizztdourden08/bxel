/* @layer core @kind constants */
import { targetScopeSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { entityChangeSchema } from './entity-change-schema';
import { idSchemaOf } from './id-schema-of';
import { BANK_ID_SCHEMA, FRAME_ID_SCHEMA, LAYER_ID_SCHEMA, SHEET_ID_SCHEMA, SPRITE_ID_SCHEMA } from './ids.constants';
import { INDEXES_SCHEMA, RECT_SCHEMA } from './shapes.constants';

const TARGET_SCOPE_SCHEMA = targetScopeSchema.meta({ id: 'TargetScope' });

const CEL_CHANGE_SCHEMA = z.strictObject({
  celId: idSchemaOf('cel'),
  layerId: LAYER_ID_SCHEMA,
  frameId: FRAME_ID_SCHEMA,
  rect: RECT_SCHEMA,
});

const SPRITE_CHANGE_SCHEMA = entityChangeSchema(SPRITE_ID_SCHEMA).extend({
  meta: z.boolean(),
  structure: z.boolean(),
  recolored: z.boolean(),
  cels: z.array(CEL_CHANGE_SCHEMA),
});

const CHANGE_SET_SCHEMA = z
  .strictObject({
    artwork: z.boolean(),
    banks: z.array(entityChangeSchema(BANK_ID_SCHEMA)),
    sprites: z.array(SPRITE_CHANGE_SCHEMA),
    sheets: z.array(entityChangeSchema(SHEET_ID_SCHEMA)),
    presets: z.array(entityChangeSchema(idSchemaOf('exp'))),
  })
  .meta({ id: 'ChangeSet' });

const PREVIEW_DATA_SCHEMA = z.strictObject({
  cels: z.array(CEL_CHANGE_SCHEMA.extend({ pixels: INDEXES_SCHEMA })),
  colorUse: z.record(z.string(), z.array(z.number().int().min(0))),
  truncated: z.boolean(),
});

const WARNING_SCHEMA = z.strictObject({
  code: z.string(),
  step: z.number().int(),
  message: z.string(),
});

export { CHANGE_SET_SCHEMA, PREVIEW_DATA_SCHEMA, TARGET_SCOPE_SCHEMA, WARNING_SCHEMA };
