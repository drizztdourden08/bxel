/* @layer core @kind constants */
import { z } from 'zod';

const control = z.record(z.string(), z.unknown());

const ITEM_SCHEMA = z.strictObject({
  key: z.string(),
  label: z.string(),
  value: z.unknown().optional().describe('Left out when the setting has no value now, or when no program may read it.'),
  settable: z.boolean(),
  locked: z.boolean(),
  why: z.string().nullable().describe('Why it is locked, or null.'),
  description: z.string().optional(),
  hint: z.string().optional(),
  control: control.optional().describe('Only with schema: the kind of control, its choices, range and unit.'),
});

const PAGE_SCHEMA = z.strictObject({
  id: z.string(),
  label: z.string(),
  route: z.string(),
  sections: z.array(z.strictObject({ id: z.string(), title: z.string(), items: z.array(ITEM_SCHEMA) })),
});

export { PAGE_SCHEMA };
