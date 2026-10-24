/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { nudgeKey } from '../../../editor/transform/nudge-key';

const canvasKeyDown = (event: KeyboardEvent<HTMLElement>): void => nudgeKey(event);

export { canvasKeyDown };
