/* @layer renderer-app @kind logic */
import { relativeLinkPath, resolveLinkPath } from '@bxel/document';
import { rewriteAssetLinks } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toSlashes } from '../workspace/to-slashes';
import type { Relocation } from './file-ops.type';

const relinkCopies = async (documents: DocumentsPort, files: readonly Relocation[]): Promise<number> => {
  const copied = new Map(files.map((file) => [toSlashes(file.from).toLowerCase(), toSlashes(file.to)] as const));
  let relinked = 0;
  for (const file of files) {
    const from = toSlashes(file.from);
    const to = toSlashes(file.to);
    const bytes = await documents.read(to).catch(() => null);
    const next =
      bytes === null
        ? null
        : rewriteAssetLinks(bytes, (link) => {
            const target = resolveLinkPath(from, link.path);
            return { id: link.id, path: relativeLinkPath(to, copied.get(target.toLowerCase()) ?? target) };
          });
    if (next === null) continue;
    await documents.write(to, next, { recent: false });
    relinked += 1;
  }
  return relinked;
};

export { relinkCopies };
