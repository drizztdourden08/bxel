/* @layer renderer-app @kind logic */
import type { Artwork, SplitPlan } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { assetPreview } from './asset-preview';
import { encodeAsset } from './encode-asset';

const writeSplit = async (kit: FileKit, artwork: Artwork, plan: SplitPlan, paths: ReadonlyMap<string, string>): Promise<readonly string[]> => {
  const written: string[] = [];
  for (const file of plan.files) {
    const path = paths.get(file.key.id);
    if (path === undefined) continue;
    const bytes = encodeAsset(artwork, file.key, paths, { preview: assetPreview(artwork, file.key), clock: kit.clock });
    await kit.documents.write(path, bytes, { recent: false });
    written.push(path);
  }
  return written;
};

export { writeSplit };
