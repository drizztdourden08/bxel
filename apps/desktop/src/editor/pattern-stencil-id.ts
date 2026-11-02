/* @layer renderer-app @kind logic */
import type { DrawingSettings } from '../stores/drawing-store.type';
import { savedBrush } from './saved-brush';
import { savedPattern } from './saved-pattern';

const patternStencilId = (drawing: Pick<DrawingSettings, 'patternId' | 'brushId'>, brushAsPattern: boolean): string | null => {
  if (savedPattern(drawing.patternId) !== null) return drawing.patternId;
  return brushAsPattern && savedBrush(drawing.brushId) !== null ? drawing.brushId : null;
};

export { patternStencilId };
