/* @layer core @kind logic */
import { z } from 'zod';
import { TOOL_PRESET_LIMITS } from './project-document.constants';

const fieldValueSchema = z.union([z.number(), z.string().max(TOOL_PRESET_LIMITS.textMax), z.boolean()]);

const toolPresetSchema = z.strictObject({
  id: z.string().min(1).max(TOOL_PRESET_LIMITS.idMax),
  name: z.string().min(1).max(TOOL_PRESET_LIMITS.nameMax),
  member: z.string().min(1).max(TOOL_PRESET_LIMITS.memberMax),
  fields: z
    .record(z.string().min(1).max(TOOL_PRESET_LIMITS.keyMax), fieldValueSchema)
    .refine((fields) => Object.keys(fields).length <= TOOL_PRESET_LIMITS.fieldsMax, { message: 'A preset holds too many fields.' }),
});

export { toolPresetSchema };
