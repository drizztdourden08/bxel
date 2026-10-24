/* @layer core @kind constants */
import { z } from 'zod';
import { DEFAULT_SCOPE_SETTINGS, SEE_SCOPES, WRITE_SCOPES } from './scope.constants';

const SCOPE_SETTINGS_SCHEMA = z.strictObject({
  see: z.enum(SEE_SCOPES),
  write: z.enum(WRITE_SCOPES),
});

const STORED_SCOPE_SCHEMA = z.object({
  see: z.enum(SEE_SCOPES).catch(DEFAULT_SCOPE_SETTINGS.see),
  write: z.enum(WRITE_SCOPES).catch(DEFAULT_SCOPE_SETTINGS.write),
});

export { SCOPE_SETTINGS_SCHEMA, STORED_SCOPE_SCHEMA };
