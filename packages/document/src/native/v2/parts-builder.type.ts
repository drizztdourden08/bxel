/* @layer core @kind types */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import type { AssetParts } from './asset-parts.type';

type PartsBuilder = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock) => AssetParts;

export type { PartsBuilder };
