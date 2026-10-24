/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { TIMELINE_LABEL } from './timeline.constants';
import { runOnCels } from './run-on-cels';

const unlinkCels = (): boolean => runOnCels(TIMELINE_LABEL.unlinkCel, COMMAND_NAME.celUnlink);

export { unlinkCels };
