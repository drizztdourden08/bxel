/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import { FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { issueText } from '../files/issue-text';
import { readArtworkFile } from '../files/read-artwork-file';
import { attachWorkspace } from './attach-workspace';
import { firstTabKey } from './first-tab-key';
import { keyId } from './key-id';
import { legacyCounts } from './legacy-counts';
import { parentOf } from './parent-of';
import { sameDirs } from './same-dirs';
import { toSlashes } from './to-slashes';
import type { WorkspaceSeed } from './workspace.type';

const isSingleSprite = (artwork: Artwork): boolean =>
  legacyCounts(artwork).sprites === 1 && artwork.sheets.length === 0 && artwork.tilesets.length === 0 && artwork.tilemaps.length === 0 && artwork.banks.length <= 1;

const legacySeed = (artwork: Artwork, path: string): WorkspaceSeed => {
  const single = isSingleSprite(artwork);
  const focus = firstTabKey(artwork);
  const dir = parentOf(path);
  return {
    kind: single ? 'loose' : 'legacy',
    name: artwork.name,
    root: dir,
    dirs: sameDirs(dir),
    projectFile: null,
    paths: new Map(),
    dirty: new Set(single && focus ? [keyId(focus)] : []),
    legacy: single ? null : { path: toSlashes(path), counts: legacyCounts(artwork) },
    artwork,
    readOnly: !single,
    unsaved: single,
    focus,
  };
};

const openLegacyFile = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const existing = kit.paths.documentAt(path);
  if (existing !== undefined && kit.host.view(existing) !== null) {
    kit.focus(existing);
    return { kind: 'done', path, notice: null };
  }
  const read = await readArtworkFile(kit.documents, path);
  if ('message' in read) return failed(read.message);
  const { report } = read;
  if (report.outcome === 'fatal' || report.artwork === null) return failed(FILE_TEXT.openFailed(fileName(path), issueText(report)));
  const seed = legacySeed(report.artwork, path);
  const documentId = attachWorkspace(kit.host, seed);
  kit.paths.remember(documentId, path);
  return { kind: 'done', path, notice: report.notice };
};

export { openLegacyFile };
