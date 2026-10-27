/* @layer core @kind constants */
import { z } from 'zod';
import { BUNDLE_IDS } from '../catalogue/bundle.constants';
import { LEVELS } from '../catalogue/level.constants';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { Grant } from './grant.type';

const LEVEL_SCHEMA = z.enum(LEVELS);

const TOOL_ROW_IDS = Object.keys(TOOL_CATALOGUE);

const GRANT_SHAPE = z.strictObject({
  v: z.literal(1),
  blocked: z.boolean(),
  bundles: z.strictObject(Object.fromEntries(BUNDLE_IDS.map((id) => [id, LEVEL_SCHEMA]))),
  tools: z.strictObject(Object.fromEntries(TOOL_ROW_IDS.map((id) => [id, LEVEL_SCHEMA.optional()]))),
  special: z.strictObject({ mayRestart: z.boolean() }),
});

const GRANT_SCHEMA = z.custom<Grant>((value) => GRANT_SHAPE.safeParse(value).success);

const STORED_GRANT_SCHEMA = z.object({
  v: z.literal(1),
  blocked: z.boolean().catch(false),
  bundles: z.record(z.string(), z.unknown()).catch({}),
  tools: z.record(z.string(), z.unknown()).catch({}),
  special: z.object({ mayRestart: z.boolean().catch(false) }).catch({ mayRestart: false }),
});

export { GRANT_SCHEMA, LEVEL_SCHEMA, STORED_GRANT_SCHEMA, TOOL_ROW_IDS };
