/* @layer core @kind types */
import type { SpriteId } from '../model/ids.type';

type SheetOverlap = { readonly first: SpriteId; readonly second: SpriteId };

type SheetSizes = ReadonlyMap<SpriteId, { readonly width: number; readonly height: number }>;

export type { SheetOverlap, SheetSizes };
