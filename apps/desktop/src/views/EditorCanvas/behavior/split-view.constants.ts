/* @layer renderer-app @kind constants */
import type { SplitControls, ViewControl } from './split-view.type';

const ACTUAL_ZOOM = 1;

const NO_CONTROL: ViewControl = {};

const NO_CONTROLS: SplitControls = { first: NO_CONTROL, second: NO_CONTROL };

export { ACTUAL_ZOOM, NO_CONTROL, NO_CONTROLS };
