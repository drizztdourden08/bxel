/* @layer core @kind types */
import type { Animation } from '../../model/animation.type';
import type { AnimationId, SheetId } from '../../model/ids.type';
import type { Sheet } from '../../model/sheet.type';
import type { EntityRef } from '../../schema/entity-ref.type';

type SheetAnimationRefs = { readonly sheet: EntityRef<SheetId>; readonly animation: EntityRef<AnimationId> };

type PickedSheetAnimation = { readonly sheet: Sheet; readonly animation: Animation };

export type { PickedSheetAnimation, SheetAnimationRefs };
