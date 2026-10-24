/* @layer renderer-app @kind logic */
import { fileName } from './file-name';
import { failed } from './failed';
import { FILE_TEXT } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';
import { issueText } from './issue-text';
import { readArtworkFile } from './read-artwork-file';

const openArtwork = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const existing = kit.paths.documentAt(path);
  if (existing !== undefined && kit.host.view(existing) !== null) {
    kit.focus(existing);
    return { kind: 'done', path, notice: null };
  }
  const read = await readArtworkFile(kit.documents, path);
  if ('message' in read) return failed(read.message);
  const { report } = read;
  if (report.outcome === 'fatal' || report.artwork === null) {
    return failed(FILE_TEXT.openFailed(fileName(path), issueText(report)));
  }
  const documentId = kit.host.open({ artwork: report.artwork, readOnly: report.readOnly });
  kit.paths.remember(documentId, path);
  const notice = report.readOnly ? (report.notice ?? FILE_TEXT.readOnly) : report.notice;
  return { kind: 'done', path, notice };
};

export { openArtwork };
