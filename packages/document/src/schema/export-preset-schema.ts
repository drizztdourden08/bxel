/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import { EXPORT_FORMAT } from '../model/export-format.constants';
import type { ExportFormat } from '../model/export-preset.type';
import type { PresetId, SheetId } from '../model/ids.type';
import type { TargetScope } from '../scope/target-scope.type';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';
import { targetScopeSchema } from './scope-schema';

const formatSchema = z.custom<ExportFormat>((value) => Object.values(EXPORT_FORMAT).some((format) => format === value));
const scopeSchema = z.custom<TargetScope>((value) => targetScopeSchema.safeParse(value).success);

const exportPresetSchema = z.object({
  id: brandedIdSchema<PresetId>(ID_PREFIX.preset),
  name: nameSchema,
  format: formatSchema,
  scale: z.number().int().min(1).max(16),
  scope: scopeSchema,
  sheetId: brandedIdSchema<SheetId>(ID_PREFIX.sheet).nullable(),
  pathTemplate: z.string().min(1),
  settings: z.record(z.string(), z.json()),
});

export { exportPresetSchema };
