/* @layer core @kind types */
import type { EntryCheck } from '../entry-check.type';
import type { OpenedAsset } from './opened-asset.type';

type ReadAsset = {
  readonly opened: OpenedAsset;
  readonly check: EntryCheck;
  readonly json: unknown;
};

export type { ReadAsset };
