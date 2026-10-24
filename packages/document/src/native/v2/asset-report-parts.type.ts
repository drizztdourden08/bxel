/* @layer core @kind types */
import type { AssetRef, AssetSlice } from '../../model/asset.type';
import type { EntryCheck } from '../entry-check.type';
import type { DamagedCel, DamagedMapLayer } from '../load-report.type';
import type { OpenedAsset } from './opened-asset.type';

type AssetReportParts = {
  readonly opened: OpenedAsset;
  readonly check: EntryCheck;
  readonly slice: AssetSlice;
  readonly damage: readonly DamagedCel[];
  readonly mapDamage?: readonly DamagedMapLayer[];
  readonly forceReadOnly?: boolean;
  readonly missing: readonly AssetRef[];
};

export type { AssetReportParts };
