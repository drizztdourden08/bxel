/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { SheetId } from '../../model/ids.type';
import type { Sheet } from '../../model/sheet.type';
import { requireSheet } from '../../read/require-sheet';
import type { EntityRef } from '../../schema/entity-ref.type';
import { resolveRefId } from '../tilemap/resolve-ref-id';

const pickSheet = (draft: Draft, ref: EntityRef<SheetId>): Sheet =>
  requireSheet(draft.artwork, resolveRefId(draft, ref, 'options.sheet'));

export { pickSheet };
