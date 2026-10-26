/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useGuideStore } from '../stores/useGuideStore';
import { useViewStore } from '../stores/useViewStore';
import type { GuideAxis } from './guide.type';
import { showGuides } from './show-guides';

const beginGuide = (axis: GuideAxis, from: number | null): boolean => {
  if (!useViewStore.getState().viewport || !currentTarget()) return false;
  showGuides();
  useGuideStore.getState().setDrag({ axis, from, position: from });
  return true;
};

export { beginGuide };
