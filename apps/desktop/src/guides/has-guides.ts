/* @layer renderer-app @kind logic */
import { guideScope } from './guide-scope';

const hasGuides = (): boolean => {
  const lines = guideScope()?.lines();
  return lines !== undefined && lines.x.length + lines.y.length > 0;
};

export { hasGuides };
