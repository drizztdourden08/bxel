/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { decodeProject } from '@bxel/document/native';
import { issueText } from '../files/issue-text';
import type { RecoveredCopy, RestoreKit } from './recovery.type';

const restoreRecovered = async (kit: RestoreKit, copy: RecoveredCopy): Promise<DocumentId> => {
  const report = decodeProject(copy.bytes);
  if (report.outcome === 'fatal' || report.project === null) throw new Error(issueText(report));
  const documentId = kit.host.open({ project: report.project, readOnly: false, unsaved: true });
  if (copy.path !== null) kit.remember(documentId, copy.path);
  kit.markRecovered(documentId);
  await kit.flush(documentId);
  return documentId;
};

export { restoreRecovered };
