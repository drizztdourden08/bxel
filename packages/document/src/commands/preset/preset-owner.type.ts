/* @layer core @kind types */
import type { SheetId, SpriteId } from '../../model/ids.type';
import type { EntityRef } from '../../schema/entity-ref.type';

type PresetOwner =
  | { readonly sprite: EntityRef<SpriteId> }
  | { readonly sheet: EntityRef<SheetId> }
  | { readonly project: true };

export type { PresetOwner };
