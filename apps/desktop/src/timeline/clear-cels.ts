/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { TIMELINE_LABEL } from './timeline.constants';
import { runOnCels } from './run-on-cels';

const clearCels = (): boolean => runOnCels(TIMELINE_LABEL.clearCel, COMMAND_NAME.celClear);

export { clearCels };
