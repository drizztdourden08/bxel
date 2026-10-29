/* @layer core @kind logic */
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import type { Zippable } from 'fflate';
import { assetManifestSchema } from '../../schema/asset-manifest-schema';
import type { AssetRef } from '../../model/asset.type';
import { DEFLATE_LEVEL, ENTRY, STORED_LEVEL, ZIP_MTIME } from '../container.constants';
import { canonicalJson } from './canonical-json';

const sameLinks = (left: readonly AssetRef[], right: readonly AssetRef[]): boolean =>
  left.length === right.length && left.every((link, at) => link.id === right[at]?.id && link.path === right[at]?.path);

const deflated = { level: DEFLATE_LEVEL } as const;
const stored = { level: STORED_LEVEL } as const;

const levelOf = (path: string) => (path === ENTRY.mimetype || path === ENTRY.preview ? stored : deflated);

/**
 * Writes new link paths into the manifest of an asset file and leaves every other byte of content as it was.
 * A change that returns null drops that link. Returns null when the file cannot be read or no link changes.
 */
const rewriteAssetLinks = (bytes: Uint8Array, change: (link: AssetRef) => AssetRef | null): Uint8Array | null => {
  try {
    const files = unzipSync(bytes);
    const raw = files[ENTRY.manifest];
    if (!raw) return null;
    const json: unknown = JSON.parse(strFromU8(raw));
    const parsed = assetManifestSchema.safeParse(json);
    if (!parsed.success) return null;
    const links = parsed.data.links.flatMap((link) => change(link) ?? []);
    if (sameLinks(parsed.data.links, links)) return null;
    const zippable: Zippable = {};
    for (const [path, data] of Object.entries(files)) {
      zippable[path] = path === ENTRY.manifest ? [strToU8(canonicalJson({ ...(json as object), links })), levelOf(path)] : [data, levelOf(path)];
    }
    return zipSync(zippable, { mtime: ZIP_MTIME });
  } catch {
    return null;
  }
};

export { rewriteAssetLinks };
