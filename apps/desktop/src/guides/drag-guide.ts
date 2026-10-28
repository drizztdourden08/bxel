/* @layer renderer-app @kind logic */
import { useGuideStore } from '../stores/useGuideStore';
import { useViewStore } from '../stores/useViewStore';
import { guideLength } from './guide-length';
import { guidePosition } from './guide-position';
import { guideScope } from './guide-scope';
import type { GuidePoint } from './guide.type';
import { overRuler } from './over-ruler';

const dragGuide = (at: GuidePoint, whole: boolean): void => {
  const { drag, setDrag } = useGuideStore.getState();
  const handle = useViewStore.getState().viewport;
  const scope = guideScope();
  const size = scope?.size();
  if (!drag || !handle || !scope || !size) return;
  const request = { axis: drag.axis, length: guideLength(drag.axis, size), whole, step: scope.step(drag.axis) };
  const position = overRuler(at) ? null : guidePosition(handle, request, at);
  if (position !== drag.position) setDrag({ ...drag, position });
};

export { dragGuide };
