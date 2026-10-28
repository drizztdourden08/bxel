/* @layer renderer-app @kind logic */
import { useGuideStore } from '../stores/useGuideStore';
import { guideScope } from './guide-scope';

const dropGuide = (): void => {
  const { drag, setDrag } = useGuideStore.getState();
  setDrag(null);
  const scope = guideScope();
  if (!drag || !scope || drag.position === drag.from) return;
  const { axis, from, position } = drag;
  if (position === null && from !== null) scope.remove(axis, from);
  else if (position !== null && from === null) scope.add(axis, position);
  else if (position !== null && from !== null) scope.move(axis, from, position);
};

export { dropGuide };
