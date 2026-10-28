/* @layer renderer-app @kind logic */
import { guideScope } from './guide-scope';
import { hasGuides } from './has-guides';

const clearGuides = (): void => {
  if (hasGuides()) guideScope()?.clear();
};

export { clearGuides };
