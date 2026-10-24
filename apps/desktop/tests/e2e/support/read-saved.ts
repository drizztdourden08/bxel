/* @layer renderer-app @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { counterIdSource, mergeSlices, resolveLinkPath } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { decodeArtwork, readAssetManifest } from '@bxel/document/native';
import { decodeAssetFiles } from '../../../src/workspace/decode-asset-files';
import type { AssetFile } from '../../../src/workspace/workspace.type';

const readOlderFile = (path: string): Artwork => {
  const report = decodeArtwork(readFileSync(path));
  if (report.outcome !== 'ok' || !report.artwork) throw new Error(`the file did not load clean: ${report.issues.map((issue) => issue.message).join(' ')}`);
  return report.artwork;
};

const linkedFiles = (start: string): AssetFile[] => {
  const files: AssetFile[] = [];
  const queue = [start.replaceAll('\\', '/')];
  for (let path = queue.shift(); path !== undefined; path = queue.shift()) {
    if (files.some((file) => file.path === path) || !existsSync(path)) continue;
    const bytes = new Uint8Array(readFileSync(path));
    const manifest = readAssetManifest(bytes);
    if (!manifest) throw new Error(`${path} is not a Bxel asset file`);
    files.push({ path, bytes, manifest });
    queue.push(...manifest.links.map((link) => resolveLinkPath(path, link.path)));
  }
  return files;
};

const readSaved = (path: string): Artwork => {
  if (path.toLowerCase().endsWith('.bxel')) return readOlderFile(path);
  const decoded = decodeAssetFiles(linkedFiles(path));
  const broken = decoded.reports.filter((each) => each.report.outcome !== 'ok');
  if (broken.length > 0) throw new Error(`the files did not load clean: ${broken.flatMap((each) => each.report.issues.map((issue) => issue.message)).join(' ')}`);
  return mergeSlices(
    decoded.sources.map(({ path: source, slice }) => ({ path: source, slice })),
    counterIdSource(),
  ).artwork;
};

export { readSaved };
