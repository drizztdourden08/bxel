/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import { decodeArtwork } from '@bxel/document/native';
import { issueText } from '../files/issue-text';
import { restoreIntoWorkspace } from '../workspace/restore-into-workspace';
import { RECOVERY_TEXT } from './recovery.constants';
import type { RecoveredCopy, RestoreKit } from './recovery.type';

const isProjectFile = (path: string | null): path is string => path?.toLowerCase().endsWith(ASSET_FORMAT.project.extension) === true;

const openCopy = async (kit: RestoreKit, path: string | null, artwork: Artwork): Promise<DocumentId> => {
  if (!isProjectFile(path)) return kit.host.open({ artwork, readOnly: false, unsaved: true });
  const workspace = await kit.project(path);
  if (workspace === null) throw new Error(RECOVERY_TEXT.projectClosed);
  const documentId = restoreIntoWorkspace(kit.host, workspace, artwork);
  if (documentId === null) throw new Error(RECOVERY_TEXT.projectBusy);
  return documentId;
};

const restoreRecovered = async (kit: RestoreKit, copy: RecoveredCopy): Promise<DocumentId> => {
  const report = decodeArtwork(copy.bytes);
  if (report.outcome === 'fatal' || report.artwork === null) throw new Error(issueText(report));
  const documentId = await openCopy(kit, copy.path, report.artwork);
  if (copy.path !== null) kit.remember(documentId, copy.path);
  kit.markRecovered(documentId);
  await kit.flush(documentId);
  return documentId;
};

export { restoreRecovered };
