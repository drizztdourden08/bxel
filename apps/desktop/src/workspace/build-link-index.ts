/* @layer renderer-app @kind logic */
import { resolveLinkPath } from '@bxel/document';
import { comparablePath } from '@bxel/project';
import { fileName } from '../files/file-name';
import { kindOfLinkPath } from './kind-of-link-path';
import type { DuplicateId, IndexedFile, IndexedLink, LinkIndex, LinkState } from './link-index.type';
import type { AssetFile } from './workspace.type';

const placeOf = (path: string): string => comparablePath(path) ?? path.toLowerCase();

const stateOf = (atPath: IndexedFile | undefined, id: string, holders: readonly IndexedFile[]): { readonly state: LinkState; readonly found: IndexedFile | null } => {
  if (atPath?.assetId === id) return { state: 'ok', found: atPath };
  const [only] = holders;
  if (holders.length === 1 && only !== undefined) return { state: 'moved', found: only };
  return { state: holders.length > 1 ? 'ambiguous' : 'missing', found: null };
};

const buildLinkIndex = (files: readonly AssetFile[]): LinkIndex => {
  const indexed: IndexedFile[] = files.map((file) => ({ path: file.path, assetId: file.manifest.assetId, kind: file.manifest.kind, name: file.manifest.name }));
  const byPath = new Map(indexed.map((file) => [placeOf(file.path), file] as const));
  const byId = new Map<string, IndexedFile[]>();
  for (const file of indexed) byId.set(file.assetId, [...(byId.get(file.assetId) ?? []), file]);
  const links: IndexedLink[] = files.flatMap((file, at) => {
    const from = indexed[at];
    if (from === undefined) return [];
    return file.manifest.links.map((link): IndexedLink => {
      const target = resolveLinkPath(file.path, link.path);
      return {
        from,
        linkId: link.id,
        stored: link.path,
        target,
        targetKind: kindOfLinkPath(link.path),
        targetName: fileName(target),
        ...stateOf(byPath.get(placeOf(target)), link.id, byId.get(link.id) ?? []),
      };
    });
  });
  const duplicates: DuplicateId[] = [...byId].flatMap(([assetId, held]) => (held.length > 1 ? [{ assetId, paths: held.map((each) => each.path) }] : []));
  return { files: indexed, links, duplicates };
};

export { buildLinkIndex };
