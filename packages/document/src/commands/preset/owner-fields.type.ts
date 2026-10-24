/* @layer core @kind types */
import type { SheetId } from '../../model/ids.type';
import type { TargetScope } from '../../scope/target-scope.type';

type OwnerFields = { readonly sheetId: SheetId | null; readonly scope: TargetScope };

export type { OwnerFields };
