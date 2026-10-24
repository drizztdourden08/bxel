/* @layer core @kind logic */
import { forkIdSource } from '../ids/fork-id-source';
import type { IdSource } from '../ids/id-source.type';
import { acceptSources } from './accept-sources';
import { composeArtwork } from './compose-artwork';
import { defaultMeta } from './default-meta';
import type { MergeResult } from './merge-result.type';
import { rekeyIssue } from './rekey-issue';
import { rekeyRecords } from './rekey-records';
import { retargetLinks } from './retarget-links';
import type { SliceSource } from './slice-source.type';
import { uniquePaths } from './unique-paths';
import type { WorkspaceMeta } from './workspace-meta.type';

const mergeSlices = (sources: readonly SliceSource[], ids: IdSource, meta?: WorkspaceMeta): MergeResult => {
  const unique = uniquePaths(sources);
  const fork = forkIdSource(ids);
  const accepted = retargetLinks(acceptSources(unique.sources, fork));
  const composed = composeArtwork(accepted, meta ?? defaultMeta(fork));
  const rekeyed = rekeyRecords(accepted);
  return {
    artwork: composed.artwork,
    rekeyed,
    issues: [...unique.issues, ...rekeyed.map(rekeyIssue), ...composed.issues],
  };
};

export { mergeSlices };
