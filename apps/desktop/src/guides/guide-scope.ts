/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { currentCanvasSurface } from '../canvas-surface/current-canvas-surface';
import { colourAwareScope } from './colour-aware-scope';
import type { GuideScope } from './guide.type';
import { mapGuideScope } from './map-guide-scope';
import { sheetGuideScope } from './sheet-guide-scope';
import { spriteGuideScope } from './sprite-guide-scope';

const bareScope = (): GuideScope | null => {
  const surface = currentCanvasSurface();
  if (surface === 'map') return mapGuideScope();
  if (surface === 'sheet') return sheetGuideScope();
  const target = currentTarget();
  return target ? spriteGuideScope(target) : null;
};

const guideScope = (): GuideScope | null => {
  const scope = bareScope();
  return scope && colourAwareScope(scope);
};

export { guideScope };
