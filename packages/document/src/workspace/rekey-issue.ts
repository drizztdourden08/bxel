/* @layer core @kind logic */
import { MERGE_ISSUE } from './merge-issue.constants';
import type { MergeIssue, RekeyRecord } from './merge-result.type';

const rekeyIssue = (record: RekeyRecord): MergeIssue => ({
  code: MERGE_ISSUE.DUPLICATE_ID,
  message: `The file ${record.path} repeats ids of another file (a copy?). It got new ids and needs saving.`,
  path: record.path,
});

export { rekeyIssue };
