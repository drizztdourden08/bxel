/* @layer renderer-app @kind test */
import { resolveLinkPath } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';
import type { Held } from '../workspace/held-rig';
import { artworkOf, openSampleProject } from '../workspace/open-sample-project';

type Opened = { readonly documentId: DocumentId; readonly spritePath: string; readonly sheetPaths: readonly string[] };

const openLinked = async (held: Held, folder: string): Promise<Opened> => {
  const { documentId, paths } = await openSampleProject(held.rig);
  const artwork = artworkOf(documentId);
  const sprite = artwork.sprites[0];
  if (!sprite) throw new Error('no sprite');
  held.rig.disk.dirs.add(folder);
  return { documentId, spritePath: paths.get(sprite.id) ?? '', sheetPaths: artwork.sheets.map((sheet) => paths.get(sheet.id) ?? '') };
};

const linkTargetsOf = (held: Held, path: string): readonly string[] => {
  const bytes = held.rig.disk.files.get(path);
  if (!(bytes instanceof Uint8Array)) throw new Error(`no file at ${path}`);
  const manifest = readAssetManifest(bytes);
  if (!manifest) throw new Error('the file did not decode');
  return manifest.links.map((link) => resolveLinkPath(path, link.path));
};

export { linkTargetsOf, openLinked };
export type { Opened };
