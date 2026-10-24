/* @layer core @kind logic */
import { DEFAULT_SCOPE_SETTINGS } from './scope.constants';
import { STORED_SCOPE_SCHEMA } from './scope-settings.constants';
import type { ScopeSettings } from './scope.type';

const normalizeScopeSettings = (stored: unknown): ScopeSettings => {
  const parsed = STORED_SCOPE_SCHEMA.safeParse(stored);
  return parsed.success ? parsed.data : DEFAULT_SCOPE_SETTINGS;
};

export { normalizeScopeSettings };
