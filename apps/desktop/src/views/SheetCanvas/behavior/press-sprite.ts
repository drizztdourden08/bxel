/* @layer renderer-app @kind logic */
import { currentScene } from '../../../sheet/current-scene';
import { pickHow } from '../../../sheet/pick-how';
import { pickSpriteById } from '../../../sheet/pick-sprite-by-id';
import type { PressInput, SheetDrag } from '../SheetCanvas.type';
import { startMove } from './start-move';

const pickedIds = () => currentScene()?.selected.map((sprite) => sprite.id) ?? [];

const pressSprite = ({ event, id, at }: PressInput): SheetDrag | null => {
  const how = pickHow(event);
  const before = pickedIds();
  if (how || !before.includes(id)) pickSpriteById(id, how ?? 'replace');
  return startMove({ id, at, collapse: how === null && before.length > 1 && before.includes(id) });
};

export { pressSprite };
