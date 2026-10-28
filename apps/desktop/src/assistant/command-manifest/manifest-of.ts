/* @layer renderer-app @kind logic */
import { LAYOUT_PREFIXES } from './manifest-of.constants';
import { MANIFEST } from './manifest.constants';
import type { ManifestEntry } from './manifest.type';

const shell = (area: ManifestEntry['area']): ManifestEntry => ({ area, effect: 'app', args: null, dialog: null, refuse: null });

const manifestOf = (id: string): ManifestEntry => {
  const found = Object.hasOwn(MANIFEST, id) ? MANIFEST[id] : undefined;
  if (found) return found;
  return shell(LAYOUT_PREFIXES.some((prefix) => id.startsWith(prefix)) ? 'layout' : 'app_control');
};

export { manifestOf };
