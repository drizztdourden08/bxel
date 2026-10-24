/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { browserIdSource } from '../documents/browser-id-source';
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import { FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { attachWorkspace } from './attach-workspace';
import { collectLinked } from './collect-linked';
import { decodeAssetFiles } from './decode-asset-files';
import { findAssetTab } from './find-asset-tab';
import { focusTab } from './focus-tab';
import { keyAt } from './key-at';
import { mergeWorkspace } from './merge-workspace';
import { parentOf } from './parent-of';
import { sameDirs } from './same-dirs';

const openAssetPath = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const open = findAssetTab(path);
  if (open) {
    focusTab(open);
    return { kind: 'done', path, notice: null };
  }
  const files = await collectLinked(kit.documents, path);
  const first = files[0];
  if (!first) return failed(FILE_TEXT.openFailed(fileName(path), FILE_TEXT.unreadable));
  const decoded = decodeAssetFiles(files);
  const report = decoded.reports.find((each) => isSamePath(each.path, first.path))?.report;
  if (!report?.slice) return failed(FILE_TEXT.openFailed(fileName(path), report?.issues[0]?.message ?? FILE_TEXT.unreadable));
  const merged = mergeWorkspace(decoded, browserIdSource());
  const dir = parentOf(first.path);
  const documentId = attachWorkspace(kit.host, {
    kind: 'loose',
    name: report.slice.name,
    root: dir,
    dirs: sameDirs(dir),
    projectFile: null,
    paths: merged.paths,
    dirty: merged.dirty,
    legacy: null,
    artwork: merged.artwork,
    readOnly: report.readOnly,
    unsaved: false,
    focus: keyAt(merged.paths, first.path, first.manifest.kind),
  });
  kit.paths.remember(documentId, first.path);
  return { kind: 'done', path, notice: report.readOnly ? (report.notice ?? FILE_TEXT.readOnly) : report.notice };
};

export { openAssetPath };
