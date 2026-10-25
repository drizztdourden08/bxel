/* @layer renderer-app @kind logic */
import { mergeSlices } from '@bxel/document';
import type { IdSource, WorkspaceMeta } from '@bxel/document';
import { keepMissingLinks } from './keep-missing-links';
import { keyId } from './key-id';
import type { DecodedFiles, MergedWorkspace } from './workspace.type';

const mergeWorkspace = (decoded: DecodedFiles, ids: IdSource, meta?: WorkspaceMeta): MergedWorkspace => {
  const merged = mergeSlices(
    decoded.sources.map(({ path, slice }) => ({ path, slice })),
    ids,
    meta,
  );
  const paths = new Map<string, string>();
  const dirty = new Set<string>();
  for (const source of decoded.sources) {
    const moved = merged.rekeyed.find((record) => record.path === source.path && record.oldId === source.slice.id);
    const key = { kind: source.slice.kind, id: moved?.newId ?? source.slice.id };
    paths.set(key.id, source.path);
    if (moved || source.relinked) dirty.add(keyId(key));
  }
  keepMissingLinks(paths, decoded.reports, merged.artwork);
  const failed = decoded.reports.filter((each) => each.report.slice === null).map((each) => each.report.issues[0]?.message ?? each.path);
  const issues = [...failed, ...merged.issues.map((issue) => issue.message)];
  return { artwork: merged.artwork, paths, dirty, issues, loaded: decoded.sources.length };
};

export { mergeWorkspace };
