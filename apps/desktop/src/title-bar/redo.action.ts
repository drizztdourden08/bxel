/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useRedoItem } from '../hooks/useRedoItem';

const order = 2;

export default defineTitleBarItem(useRedoItem);
export { order };
