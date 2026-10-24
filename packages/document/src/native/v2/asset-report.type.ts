/* @layer core @kind types */
import type { AssetRef, AssetSlice } from '../../model/asset.type';
import type { DamagedCel, LoadIssue, LoadOutcome } from '../load-report.type';
import type { AssetManifest } from './asset-manifest.type';

type AssetReport = {
  readonly outcome: LoadOutcome;
  readonly slice: AssetSlice | null;
  readonly readOnly: boolean;
  readonly notice: string | null;
  readonly manifest: AssetManifest | null;
  readonly preview: Uint8Array | null;
  readonly issues: readonly LoadIssue[];
  readonly damage: readonly DamagedCel[];
  readonly missingLinks: readonly AssetRef[];
};

export type { AssetReport };
