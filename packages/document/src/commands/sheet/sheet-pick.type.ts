/* @layer core @kind types */
import type { Animation } from '../../model/animation.type';
import type { AnimationId, SheetId } from '../../model/ids.type';
import type { Sheet, SheetAnimationEntry } from '../../model/sheet.type';
import type { AnimTagRef } from '../../schema/animation-options.type';
import type { EntityRef } from '../../schema/entity-ref.type';

type SheetAnimationRefs = { readonly sheet: EntityRef<SheetId>; readonly animation: EntityRef<AnimationId> };

type SheetEntryRefs = SheetAnimationRefs & { readonly tag?: AnimTagRef | null };

type PickedSheetAnimation = { readonly sheet: Sheet; readonly animation: Animation };

type PickedSheetEntries = PickedSheetAnimation & {
  readonly entries: readonly SheetAnimationEntry[];
  readonly hit: (entry: SheetAnimationEntry) => boolean;
};

export type { PickedSheetAnimation, PickedSheetEntries, SheetAnimationRefs, SheetEntryRefs };
