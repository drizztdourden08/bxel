/* @layer renderer-app @kind logic */
import type { LoadReport } from '@bxel/document/native';
import { FILE_TEXT, ISSUE_LIMIT } from './files.constants';

const issueText = (report: LoadReport): string => {
  const messages = report.issues.slice(0, ISSUE_LIMIT).map((issue) => issue.message);
  return messages.length > 0 ? messages.join(' ') : FILE_TEXT.unreadable;
};

export { issueText };
