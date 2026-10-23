/* @layer core @kind logic */
import { collectIds } from './collect-ids';
import type { DocumentJson } from './document-json.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const checkUniqueIds = (document: DocumentJson): readonly LoadIssue[] => {
  const seen = new Map<string, string>();
  const issues: LoadIssue[] = [];
  for (const site of collectIds(document)) {
    const first = seen.get(site.id);
    if (first === undefined) seen.set(site.id, site.path);
    else issues.push(makeIssue(LOAD_ERROR.REFERENCE_BROKEN, `The id ${site.id} is already used at ${first}.`, site.path));
  }
  return issues;
};

export { checkUniqueIds };
