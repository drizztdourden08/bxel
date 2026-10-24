/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { SplitPlan } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { baseName } from '../files/base-name';
import { toSlashes } from './to-slashes';
import { uniquePath } from './unique-path';
import type { AssetDirs } from './workspace.type';

const existing = async (documents: DocumentsPort, dirs: readonly string[]): Promise<Set<string>> => {
  const taken = new Set<string>();
  for (const dir of new Set(dirs)) {
    const listing = await documents.list(dir).catch(() => ({ entries: [] }));
    for (const entry of listing.entries) taken.add(toSlashes(entry.path).toLowerCase());
  }
  return taken;
};

const splitPaths = async (documents: DocumentsPort, plan: SplitPlan, dirs: AssetDirs): Promise<Map<string, string>> => {
  const folders = plan.files.flatMap((file) => dirs[file.key.kind] ?? []);
  const taken = await existing(documents, folders);
  const paths = new Map<string, string>();
  for (const file of plan.files) {
    const dir = dirs[file.key.kind];
    if (dir === undefined) continue;
    const path = uniquePath(dir, baseName(file.fileName), ASSET_FORMAT[file.key.kind].extension, taken);
    taken.add(path.toLowerCase());
    paths.set(file.key.id, path);
  }
  return paths;
};

export { splitPaths };
