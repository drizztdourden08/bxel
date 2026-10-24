/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { AssetKind } from '../model/asset.type';
import type { MERGE_ISSUE } from './merge-issue.constants';

type MergeIssueCode = (typeof MERGE_ISSUE)[keyof typeof MERGE_ISSUE];

type MergeIssue = { readonly code: MergeIssueCode; readonly message: string; readonly path: string | null };

type RekeyRecord = {
  readonly path: string;
  readonly kind: AssetKind;
  readonly oldId: string;
  readonly newId: string;
  readonly count: number;
};

type MergeResult = {
  readonly artwork: Artwork;
  readonly rekeyed: readonly RekeyRecord[];
  readonly issues: readonly MergeIssue[];
};

export type { MergeIssue, MergeIssueCode, MergeResult, RekeyRecord };
