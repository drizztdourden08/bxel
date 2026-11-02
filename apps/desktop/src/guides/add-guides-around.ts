/* @layer renderer-app @kind logic */
import { selectionRect } from '../view-zoom/selection-rect';
import { guideScope } from './guide-scope';
import { showGuides } from './show-guides';

const addGuidesAround = (): void => {
  const scope = guideScope();
  const rect = selectionRect();
  if (!scope || !rect) return;
  showGuides();
  scope.addMany({ x: [rect.x, rect.x + rect.width], y: [rect.y, rect.y + rect.height] });
};

export { addGuidesAround };
