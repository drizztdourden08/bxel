/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { MergeIssue } from './merge-result.type';
import type { WorkspaceMeta } from './workspace-meta.type';
import type { SliceSource } from './slice-source.type';

type Composed = { readonly artwork: Artwork; readonly issues: readonly MergeIssue[] };

type Settled = { readonly meta: WorkspaceMeta; readonly issues: readonly MergeIssue[] };

type Uniqued = { readonly sources: readonly SliceSource[]; readonly issues: readonly MergeIssue[] };

export type { Composed, Settled, Uniqued };
