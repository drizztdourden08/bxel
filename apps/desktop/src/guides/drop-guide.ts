/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { useGuideStore } from '../stores/useGuideStore';
import { GUIDE_LABEL } from './guide.constants';
import { runGuide } from './run-guide';

const dropGuide = (): void => {
  const { drag, setDrag } = useGuideStore.getState();
  setDrag(null);
  if (!drag || drag.position === drag.from) return;
  const { axis, from, position } = drag;
  if (position === null && from !== null) runGuide(GUIDE_LABEL.remove, COMMAND_NAME.guideRemove, { axis, position: from });
  else if (position !== null && from === null) runGuide(GUIDE_LABEL.add, COMMAND_NAME.guideAdd, { axis, position });
  else if (position !== null && from !== null) runGuide(GUIDE_LABEL.move, COMMAND_NAME.guideMove, { axis, from, to: position });
};

export { dropGuide };
