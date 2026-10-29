/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import { openSharedRig, SHARED } from './hidden-folder-rig';
import { linksIn } from './links-in';
import type { Disk } from './memory-disk';
import { ROOT } from './project-harness';
import { toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

type FileRig = {
  readonly current: ToolRig;
  readonly artwork: Artwork;
  readonly place: (path: string) => { readonly folderId: string; readonly path: string };
  readonly spritePath: () => string;
  readonly sheetPaths: () => readonly string[];
  readonly linksOf: (path: string) => readonly string[];
};

const rigAround = (current: ToolRig, artwork: Artwork, paths: () => ReadonlyMap<string, string>): FileRig => ({
  current,
  artwork,
  place: (path) => ({ folderId: current.folderId, path: path.slice(ROOT.length + 1) }),
  spritePath: () => paths().get(artwork.sprites[0]?.id ?? '') ?? '',
  sheetPaths: () => artwork.sheets.map((sheet) => paths().get(sheet.id) ?? ''),
  linksOf: (path) => linksIn(current.rig.disk, path),
});

const openFileRig = async (): Promise<FileRig> => {
  const artwork = sampleArtwork();
  let paths: ReadonlyMap<string, string> = new Map();
  const current = await toolRig({
    seed: (disk) => {
      paths = writeProjectAssets(disk, ROOT, artwork);
      disk.dirs.add(`${ROOT}/heroes`);
    },
  });
  return rigAround(current, artwork, () => paths);
};

const seedHidden =
  (artwork: Artwork, keep: (paths: ReadonlyMap<string, string>) => void) =>
  (disk: Disk): void => {
    const sheet = artwork.sheets[0];
    keep(writeProjectAssets(disk, ROOT, artwork, new Map([[sheet?.id ?? '', `${SHARED}/hidden-sheet.bxsheet`]])));
    disk.dirs.add(SHARED);
    disk.dirs.add(`${ROOT}/heroes`);
    disk.granted.add(key(SHARED));
  };

const openHiddenFileRig = async (): Promise<FileRig> => {
  const artwork = sampleArtwork();
  let paths: ReadonlyMap<string, string> = new Map();
  const current = await openSharedRig(
    seedHidden(artwork, (written) => {
      paths = written;
    }),
  );
  return rigAround(current, artwork, () => paths);
};

export { openFileRig, openHiddenFileRig };
export type { FileRig };
