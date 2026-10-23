/* @layer core @kind types */
import type { Sprite } from '../model/sprite.type';
import type { DamagedCel } from './load-report.type';

type RestoredSprite = { readonly sprite: Sprite; readonly damage: readonly DamagedCel[] };

export type { RestoredSprite };
