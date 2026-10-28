/* @layer renderer-app @kind logic */
import { assetPathOf } from '../../../sheet-manager/asset-path-of';
import type { DragEntry } from '../../../sheet-manager/drag-payload.type';
import { entryId } from '../../../sheet-manager/entry-id';
import type { EntryFacts } from '../../../sheet-manager/manager.type';

const entryOf = (fact: EntryFacts): DragEntry =>
  fact.kind === 'sprite'
    ? { kind: 'sprite', assetId: fact.sprite.id, path: assetPathOf(fact.sprite.id) }
    : { kind: 'animation', assetId: fact.animation.id, tagId: fact.tagId, path: assetPathOf(fact.animation.id) };

/** The entries of the picked keys, in the order the browser shows them. */
const defaultDragEntries = (entries: readonly EntryFacts[], keys: readonly string[]): DragEntry[] =>
  entries.filter((fact) => keys.includes(entryId(fact))).map(entryOf);

export { defaultDragEntries };
