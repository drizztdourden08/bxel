/* @layer renderer-app @kind logic */
import { isListableName, relativeInside } from '@bxel/project';
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from '../workspace/to-slashes';
import type { BrowserEntry, BrowserRoot, ListedEntries } from './project-browser.type';

const listable = (root: string, entry: DocumentEntry): boolean => {
  const relative = relativeInside(root, entry.path);
  return relative !== undefined && relative !== '' && relative.split(/[\\/]/).every(isListableName);
};

const entryOf = (root: string, entry: DocumentEntry): BrowserEntry => ({
  path: toSlashes(entry.path),
  name: entry.name,
  isFolder: entry.kind === 'folder',
  size: entry.size,
  modified: entry.modified,
  rootPath: root,
});

const listBrowserEntries = async (documents: DocumentsPort, roots: readonly BrowserRoot[]): Promise<ListedEntries> => {
  const entries: BrowserEntry[] = [];
  const failed: string[] = [];
  let truncated = false;
  for (const root of roots.filter((each) => each.granted)) {
    const rootPath = toSlashes(root.path);
    const listing = await documents.list(root.path, { recursive: true }).catch(() => null);
    if (listing === null) {
      failed.push(rootPath);
      continue;
    }
    truncated ||= listing.truncated;
    for (const entry of listing.entries) if (listable(root.path, entry)) entries.push(entryOf(rootPath, entry));
  }
  return { entries, truncated, failed };
};

export { listBrowserEntries };
