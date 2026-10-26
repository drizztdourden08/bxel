/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useGuideStore } from '../stores/useGuideStore';
import { useViewStore } from '../stores/useViewStore';
import { guideLength } from './guide-length';
import { guidePosition } from './guide-position';
import type { GuidePoint } from './guide.type';
import { overRuler } from './over-ruler';

const dragGuide = (at: GuidePoint, whole: boolean): void => {
  const { drag, setDrag } = useGuideStore.getState();
  const handle = useViewStore.getState().viewport;
  const target = currentTarget();
  if (!drag || !handle || !target) return;
  const position = overRuler(at) ? null : guidePosition(handle, { axis: drag.axis, length: guideLength(drag.axis, target.sprite), whole }, at);
  if (position !== drag.position) setDrag({ ...drag, position });
};

export { dragGuide };
