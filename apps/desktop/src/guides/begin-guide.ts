/* @layer renderer-app @kind logic */
import { useGuideStore } from '../stores/useGuideStore';
import { useViewStore } from '../stores/useViewStore';
import type { GuideAxis } from './guide.type';
import { guideScope } from './guide-scope';
import { showGuides } from './show-guides';

const beginGuide = (axis: GuideAxis, from: number | null): boolean => {
  const view = useViewStore.getState();
  if (!view.viewport || !guideScope()) return false;
  if (from !== null && view.lockGuides) return false;
  showGuides();
  useGuideStore.getState().setDrag({ axis, from, position: from });
  return true;
};

export { beginGuide };
