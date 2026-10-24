/* @layer renderer-app @kind logic */
import type { ImportContext, ImportKind } from './image-import.type';

const takenNames = (kind: ImportKind, context: ImportContext): readonly string[] =>
  kind === 'tiled' ? context.tilemapNames : context.taken;

export { takenNames };
