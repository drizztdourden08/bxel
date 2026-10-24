/* @layer renderer-app @kind logic */
import { beginPending } from '../pending/begin-pending';
import { ROTATE_START } from './transform.constants';

const startRotate = (): boolean => beginPending({ kind: 'rotate', angle: ROTATE_START, bounds: 'crop' }, true);

export { startRotate };
