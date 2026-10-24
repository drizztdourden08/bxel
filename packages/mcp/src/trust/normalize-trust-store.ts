/* @layer core @kind logic */
import { programKey } from './program-key';
import { trimPrograms } from './trim-programs';
import { DEFAULT_TRUST_STORE } from './trust.constants';
import { STORED_TRUST_SCHEMA, TRUST_ENTRY_SCHEMA } from './trust-store-schema.constants';
import type { TrustEntry, TrustStore } from './trust.type';

const entryOf = (raw: unknown): TrustEntry[] => {
  const parsed = TRUST_ENTRY_SCHEMA.safeParse(raw);
  const key = parsed.success ? programKey(parsed.data.key) : null;
  return parsed.success && key !== null ? [{ ...parsed.data, key }] : [];
};

const normalizeTrustStore = (stored: unknown): TrustStore => {
  const parsed = STORED_TRUST_SCHEMA.safeParse(stored);
  if (!parsed.success) return DEFAULT_TRUST_STORE;
  const unique = new Map(parsed.data.programs.flatMap(entryOf).map((entry) => [entry.key, entry]));
  return {
    level: parsed.data.level,
    allowAllMode: parsed.data.allowAllMode,
    programs: trimPrograms([...unique.values()]),
  };
};

export { normalizeTrustStore };
