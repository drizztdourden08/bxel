/* @layer renderer-app @kind test */
import { readFileSync } from 'node:fs';
import { resolveLinkPath } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';

const slash = (path: string): string => path.replaceAll('\\', '/');

const linkTargets = (path: string): readonly string[] => {
  const manifest = readAssetManifest(new Uint8Array(readFileSync(path)));
  if (!manifest) throw new Error('the file did not read');
  return manifest.links.map((link) => resolveLinkPath(slash(path), link.path));
};

export { linkTargets, slash };
