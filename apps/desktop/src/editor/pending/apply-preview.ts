/* @layer renderer-app @kind logic */
import { closePolygon } from '../selection/close-polygon';
import { commitPending } from './commit-pending';

const applyPreview = (): boolean => closePolygon() || commitPending();

export { applyPreview };
