/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';

const axisLength = (axis: 'x' | 'y'): number | null => {
  const target = currentTarget();
  if (!target) return null;
  return axis === 'x' ? target.sprite.width : target.sprite.height;
};

export { axisLength };
