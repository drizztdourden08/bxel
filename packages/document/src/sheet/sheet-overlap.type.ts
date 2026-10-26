/* @layer core @kind types */
import type { AnimationId, SpriteId, TagId } from '../model/ids.type';

type SheetOverlap = { readonly first: SpriteId; readonly second: SpriteId };

type SheetSizes = ReadonlyMap<SpriteId, { readonly width: number; readonly height: number }>;

type SheetPart =
  | { readonly kind: 'sprite'; readonly spriteId: SpriteId }
  | { readonly kind: 'animation'; readonly animationId: AnimationId; readonly tagId: TagId | null };

type SheetPartOverlap = { readonly first: SheetPart; readonly second: SheetPart };

type SheetBox = { readonly part: SheetPart; readonly left: number; readonly top: number; readonly right: number; readonly bottom: number };

export type { SheetBox, SheetOverlap, SheetPart, SheetPartOverlap, SheetSizes };
