/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { currentSurface } from '../surface/current-surface';
import type { GuideScope } from './guide.type';
import { spriteGuideScope } from './sprite-guide-scope';
import { currentViewGuideScope } from './view-guide-scope';

const guideScope = (): GuideScope | null => {
  const surface = currentSurface();
  if (surface === 'sheet' || surface === 'map') return currentViewGuideScope(surface === 'map');
  const target = currentTarget();
  return target ? spriteGuideScope(target) : null;
};

export { guideScope };
