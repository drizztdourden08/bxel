/* @layer core @kind logic */
import { checkIntegrity } from '../check-integrity';
import type { DocumentJson } from '../document-json.type';
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';

const checkAssetFile = (manifestId: string, contentId: string, document: DocumentJson): readonly LoadIssue[] => {
  const issues = checkIntegrity(document);
  if (manifestId === contentId) return issues;
  const mismatch = makeIssue(LOAD_ERROR.DOCUMENT_INVALID, 'The file and its manifest name different assets.', '$.id');
  return [mismatch, ...issues];
};

export { checkAssetFile };
