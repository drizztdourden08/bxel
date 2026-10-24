/* @layer core @kind logic */
import { MERGE_ISSUE } from './merge-issue.constants';
import type { Uniqued } from './composed.type';
import type { MergeIssue } from './merge-result.type';
import type { SliceSource } from './slice-source.type';

const uniquePaths = (sources: readonly SliceSource[]): Uniqued => {
  const seen = new Set<string>();
  const kept: SliceSource[] = [];
  const issues: MergeIssue[] = [];
  for (const source of sources) {
    if (seen.has(source.path)) {
      issues.push({ code: MERGE_ISSUE.DUPLICATE_PATH, message: `The file ${source.path} was listed twice.`, path: source.path });
      continue;
    }
    seen.add(source.path);
    kept.push(source);
  }
  return { sources: kept, issues };
};

export { uniquePaths };
