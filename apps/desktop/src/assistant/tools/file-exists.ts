/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';

const fileExists = async (documents: DocumentsPort, path: string): Promise<boolean> => {
  const slash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  try {
    const listing = await documents.list(path.slice(0, slash));
    const name = path.slice(slash + 1).toLowerCase();
    return listing.entries.some((entry) => entry.kind === 'file' && entry.name.toLowerCase() === name);
  } catch {
    return false;
  }
};

export { fileExists };
