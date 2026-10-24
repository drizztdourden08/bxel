/* @layer core @kind constants */
import { z } from 'zod';
import { DEFAULT_TRUST_STORE, PROGRAM_MODES, SESSION_MODES, TRUST_LEVELS } from './trust.constants';

const TRUST_ENTRY_SCHEMA = z.object({
  key: z.string(),
  displayName: z.string(),
  mode: z.enum(PROGRAM_MODES),
  firstApproved: z.string(),
  lastConnected: z.string(),
  lastVersion: z.string().nullable().catch(null),
});

const STORED_TRUST_SCHEMA = z.object({
  level: z.enum(TRUST_LEVELS).catch(DEFAULT_TRUST_STORE.level),
  allowAllMode: z.enum(SESSION_MODES).catch(DEFAULT_TRUST_STORE.allowAllMode),
  programs: z.array(z.unknown()).catch([]),
});

export { STORED_TRUST_SCHEMA, TRUST_ENTRY_SCHEMA };
