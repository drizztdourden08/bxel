/* @layer renderer-app @kind logic */
import type { ImportContext, ImportKind } from './image-import.type';

const takenNames = (kind: ImportKind, context: ImportContext): readonly string[] => {
  if (kind === 'tiled') return context.tilemapNames;
  return kind === 'animation' || kind === 'strip' ? context.animationNames : context.taken;
};

export { takenNames };
