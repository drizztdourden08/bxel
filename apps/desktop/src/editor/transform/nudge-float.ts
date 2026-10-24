/* @layer renderer-app @kind logic */
import { floatOffset } from '../pending/float-offset';
import { setFloatOffset } from '../pending/set-float-offset';
import { useToolStore } from '../../stores/useToolStore';
import { startMove } from './start-move';

const nudgeFloat = (dx: number, dy: number): boolean => {
  if (floatOffset() === null && (useToolStore.getState().tool !== 'move' || !startMove())) return false;
  const offset = floatOffset();
  if (offset) setFloatOffset({ x: offset.x + dx, y: offset.y + dy });
  return true;
};

export { nudgeFloat };
