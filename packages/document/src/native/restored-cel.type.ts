/* @layer core @kind types */
import type { Cel } from '../model/sprite.type';
import type { DamagedCel } from './load-report.type';

type RestoredCel = { readonly cel: Cel; readonly damage: DamagedCel | null };

export type { RestoredCel };
