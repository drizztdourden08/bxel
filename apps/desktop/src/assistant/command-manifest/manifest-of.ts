/* @layer renderer-app @kind logic */
import { MANIFEST } from './manifest.constants';
import type { ManifestEntry } from './manifest.type';

const LAYOUT_PREFIXES = ['toolbar.', 'widget.', 'layout.'];

const shell = (area: ManifestEntry['area']): ManifestEntry => ({ area, effect: 'app', args: null, dialog: null, refuse: null });

const manifestOf = (id: string): ManifestEntry => {
  const found = Object.hasOwn(MANIFEST, id) ? MANIFEST[id] : undefined;
  if (found) return found;
  return shell(LAYOUT_PREFIXES.some((prefix) => id.startsWith(prefix)) ? 'layout' : 'app_control');
};

const inManifest = (id: string): boolean => Object.hasOwn(MANIFEST, id);

export { inManifest, manifestOf };
