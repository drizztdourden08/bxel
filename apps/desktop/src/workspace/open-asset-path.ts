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
import { looseFileSeed } from './loose-file-seed';
import { looseMeta } from './loose-meta';
import { mergeWorkspace } from './merge-workspace';
import { migrateAnimated } from './migrate-animated';
import type { LooseLoad } from './workspace.type';

const loadLoose = async (kit: FileKit, path: string): Promise<LooseLoad | FileOutcome> => {
  const files = await collectLinked(kit.documents, path);
  const first = files[0];
  if (!first) return failed(FILE_TEXT.openFailed(fileName(path), FILE_TEXT.unreadable));
  const decoded = decodeAssetFiles(files, kit.keepStoredNames === true);
  const report = decoded.reports.find((each) => isSamePath(each.path, first.path))?.report;
  if (!report?.slice) return failed(FILE_TEXT.openFailed(fileName(path), report?.issues[0]?.message ?? FILE_TEXT.unreadable));
  return { first, report, decoded };
};

const openAssetPath = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const open = findAssetTab(path);
  if (open) {
    focusTab(open);
    return { kind: 'done', path, notice: null };
  }
  const loaded = await loadLoose(kit, path);
  if ('kind' in loaded) return loaded;
  const { first, report, decoded } = loaded;
  const ids = browserIdSource();
  const documentId = attachWorkspace(kit.host, looseFileSeed(first, report, migrateAnimated(mergeWorkspace(decoded, ids, looseMeta(ids, report.slice?.name ?? '')), ids, false)));
  kit.paths.remember(documentId, first.path);
  const notice = report.readOnly ? (report.notice ?? FILE_TEXT.readOnly) : report.notice;
  return { kind: 'done', path, notice };
};

export { openAssetPath };
