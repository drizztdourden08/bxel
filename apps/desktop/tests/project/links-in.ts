/* @layer renderer-app @kind test */
import { resolveLinkPath } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';
import type { AssetManifest } from '@bxel/document/native';
import type { Disk } from './memory-disk';

const manifestIn = (disk: Disk, path: string): AssetManifest => {
  const bytes = disk.files.get(path);
  const manifest = bytes instanceof Uint8Array ? readAssetManifest(bytes) : null;
  if (!manifest) throw new Error(`no asset file at ${path}`);
  return manifest;
};

const linksIn = (disk: Disk, path: string): readonly string[] => manifestIn(disk, path).links.map((link) => resolveLinkPath(path, link.path));

export { linksIn, manifestIn };
