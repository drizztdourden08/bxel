/* @layer renderer-app @kind logic */
import { currentScene } from '../../../sheet/current-scene';
import type { SheetDrag, StartMoveInput } from '../SheetCanvas.type';

const startMove = ({ id, at, collapse }: StartMoveInput): SheetDrag | null => {
  const ids = currentScene()?.selected.map((sprite) => sprite.id) ?? [];
  if (!ids.includes(id)) return null;
  return { kind: 'move', ids, start: at, delta: { x: 0, y: 0 }, pending: collapse ? id : null };
};

export { startMove };
