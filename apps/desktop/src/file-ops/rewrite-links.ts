/* @layer renderer-app @kind logic */
import { relativeLinkPath, resolveLinkPath } from '@bxel/document';
import type { AssetRef } from '@bxel/document';
import { rewriteAssetLinks } from '@bxel/document/native';
import type { FileKit } from '../files/files.type';
import { movedPath } from '../files/moved-path';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetHash } from '../workspace/asset-hash';
import { keyId } from '../workspace/key-id';
import { toSlashes } from '../workspace/to-slashes';
import type { Affected, Relocation } from './file-ops.type';

const relocated = (path: string, moves: readonly Relocation[]): string => {
  for (const move of moves) {
    const next = movedPath(path, toSlashes(move.from), toSlashes(move.to));
    if (next !== null && next !== path) return next;
  }
  return path;
};

const retarget =
  (before: string, after: string, moves: readonly Relocation[]) =>
  (link: AssetRef): AssetRef => ({ id: link.id, path: relativeLinkPath(after, relocated(resolveLinkPath(before, link.path), moves)) });

const writeOne = async (kit: Pick<FileKit, 'documents'>, moves: readonly Relocation[], file: Affected, after: string): Promise<boolean> => {
  const bytes = await kit.documents.read(after).catch(() => null);
  const next = bytes === null ? null : rewriteAssetLinks(bytes, retarget(toSlashes(file.from), after, moves));
  if (next === null) return false;
  await kit.documents.write(after, next, { recent: false });
  return true;
};

const settleClean = (written: readonly Affected[]): void => {
  const { patch } = useWorkspaceStore.getState();
  for (const documentId of new Set(written.map((each) => each.documentId))) {
    patch(documentId, (workspace) => {
      const saved = new Map(workspace.saved);
      for (const each of written.filter((one) => one.documentId === documentId)) {
        const id = keyId(each.key);
        const hash = workspace.dirty.has(id) ? null : assetHash(workspace.last, each.key, workspace.paths);
        if (hash !== null) saved.set(id, hash);
      }
      return { ...workspace, saved };
    });
  }
};

const rewriteLinks = async (kit: Pick<FileKit, 'documents'>, moves: readonly Relocation[], affected: readonly Affected[]): Promise<number> => {
  const written: Affected[] = [];
  for (const file of affected) {
    const after = useWorkspaceStore.getState().workspaces[file.documentId]?.paths.get(file.key.id);
    if (after !== undefined && (await writeOne(kit, moves, file, toSlashes(after)))) written.push(file);
  }
  settleClean(written);
  return written.filter((file) => file.referrer).length;
};

export { rewriteLinks };
