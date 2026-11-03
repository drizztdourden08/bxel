/* @layer renderer-app @kind logic */
import { NAVIGATOR_KEY_SHARE } from '../Navigator.constants';
import type { KeySteps, VisibleSize } from '../Navigator.type';

const keySteps = (visible: VisibleSize): KeySteps => ({
  step: { x: Math.max(1, visible.width * NAVIGATOR_KEY_SHARE), y: Math.max(1, visible.height * NAVIGATOR_KEY_SHARE) },
  bigStep: { x: Math.max(1, visible.width), y: Math.max(1, visible.height) },
});

export { keySteps };
