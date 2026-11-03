/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { NavigatorFacts } from '../Navigator.type';
import { describeView } from './describe-view';
import { shownPercent } from './shown-percent';
import { visibleRect } from './visible-rect';

const navigatorFacts = (view: PixelView | null): NavigatorFacts | null => {
  if (!view) return null;
  const rect = visibleRect(view);
  return { ...rect, imageWidth: view.imageWidth, imageHeight: view.imageHeight, said: describeView(view), percent: shownPercent(view) };
};

export { navigatorFacts };
