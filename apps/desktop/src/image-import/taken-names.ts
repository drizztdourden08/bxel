/* @layer renderer-app @kind logic */
import type { ImportContext, ImportKind } from './image-import.type';

const takenNames = (kind: ImportKind, context: ImportContext): readonly string[] => {
  if (kind === 'tiled') return context.tilemapNames;
  if (kind === 'tileset') return context.tilesetNames;
  return kind === 'animation' || kind === 'strip' ? context.animationNames : context.taken;
};

export { takenNames };
