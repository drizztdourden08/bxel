/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { GUIDE_LABEL } from './guide.constants';
import { hasGuides } from './has-guides';
import { runGuide } from './run-guide';

const clearGuides = (): void => {
  if (hasGuides()) runGuide(GUIDE_LABEL.clear, COMMAND_NAME.guideClear, {});
};

export { clearGuides };
