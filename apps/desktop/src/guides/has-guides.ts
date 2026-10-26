/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';

const hasGuides = (): boolean => {
  const guides = currentTarget()?.sprite.guides;
  return guides !== undefined && guides.x.length + guides.y.length > 0;
};

export { hasGuides };
