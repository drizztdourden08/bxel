/* @layer core @kind logic */
import type { SETTING_ROWS } from './setting-rows.constants';

const scopeOf = (input: unknown): keyof typeof SETTING_ROWS | null => {
  const scope: unknown = typeof input === 'object' && input !== null && 'scope' in input ? input.scope : undefined;
  return scope === 'app' || scope === 'project' || scope === 'asset' ? scope : null;
};

export { scopeOf };
