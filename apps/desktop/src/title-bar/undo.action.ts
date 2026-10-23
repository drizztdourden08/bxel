/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useUndoItem } from '../hooks/useUndoItem';

const order = 1;

export default defineTitleBarItem(useUndoItem);
export { order };
