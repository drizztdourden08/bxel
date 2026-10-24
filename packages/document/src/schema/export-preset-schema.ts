/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { PresetId, SheetId } from '../model/ids.type';
import type { TargetScope } from '../scope/target-scope.type';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';
import { presetFormatSchema } from './preset-format-schema';
import { presetScopeSchema } from './preset-scope-schema';

const scopeSchema = z.custom<TargetScope>((value) => presetScopeSchema.safeParse(value).success);

const exportPresetSchema = z.object({
  id: brandedIdSchema<PresetId>(ID_PREFIX.preset),
  name: nameSchema,
  format: presetFormatSchema,
  scale: z.number().int().min(1).max(16),
  scope: scopeSchema,
  sheetId: brandedIdSchema<SheetId>(ID_PREFIX.sheet).nullable(),
  pathTemplate: z.string().min(1),
  settings: z.record(z.string(), z.json()),
});

export { exportPresetSchema };
